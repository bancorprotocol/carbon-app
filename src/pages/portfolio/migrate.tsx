import { useEffect, useMemo, useState } from 'react';
import {
  Contract,
  getAddress,
  formatUnits,
  Provider,
  TransactionRequest,
} from 'ethers';
import { useWagmi } from 'libs/wagmi';
import { Pool, Position, TickMath, tickToPrice } from '@uniswap/v3-sdk';
import { Token, ChainId } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import { useTokens } from 'hooks/useTokens';
import { SafeDecimal } from 'libs/safedecimal';
import { useGetMultipleTokenPrices } from 'libs/queries/extApi/tokenPrice';
import { getUsdPrice, tokenAmount } from 'utils/helpers';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { carbonSDK } from 'libs/sdk';
import config from 'config';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { getFullRangesPrices } from 'components/strategies/common/utils';

const dexNames = {
  'uniswap-v2': 'Uniswap V2',
  'uniswap-v3': 'Uniswap V3',
};
type Dexes = keyof typeof dexNames;

// GRAPHQL //
const apikey = import.meta.env.VITE_SUBGRAPH_APIKEY;
const V2_SUBGRAPH = `https://gateway.thegraph.com/api/${apikey}/subgraphs/id/A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum`;
const V3_SUBGRAPH = `https://gateway.thegraph.com/api/${apikey}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

interface GraphQLResponse<T> {
  errors: any;
  data: T;
}

async function graphQuery<T>(url: string, query: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const json = await response.json<GraphQLResponse<T>>();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

// --- Interface ---
export interface UniswapPosition {
  id: string; // Pair Address (V2) or NFT ID (V3)
  dex: Dexes;
  base: string; // Token0 Address
  quote: string; // Token1 Address
  min: string; // TickLower (V3) or 0 (V2)
  max: string; // TickUpper (V3) or MaxInt (V2)
  baseLiquidity: string; // Amount of Token0
  quoteLiquidity: string; // Amount of Token1
  baseFee: string; // Uncollected Fees Token0
  quoteFee: string; // Uncollected Fees Token1
  fee: string; // Fee Tier (e.g. "3000" for 0.3%)
}

export interface GraphToken {
  id: string; // Address
  decimals: string; // Often returned as string, requires parsing
  symbol?: string; // Optional if you add it to query later
}
export interface UniswapV2Pair {
  id: string;
  token0: GraphToken;
  token1: GraphToken;
  totalSupply: string;
  reserve0: string;
  reserve1: string;
}

export interface UniswapV2LiquidityPosition {
  pair: UniswapV2Pair;
  liquidityTokenBalance: string;
}

export interface UniswapV2User {
  liquidityPositions: UniswapV2LiquidityPosition[];
}

// Top-level response from The Graph
export interface UniswapV2GraphResponse {
  user: UniswapV2User | null; // Null if user has never interacted
}

/**
 * Main function to fetch and unify positions from The Graph
 */
export async function getPositions(
  provider: Provider,
  userAddress: string,
): Promise<UniswapPosition[]> {
  const normalizedUser = userAddress.toLowerCase();

  // Run queries in parallel
  const [v2Positions, v3Positions] = await Promise.all([
    fetchV2PositionsGraph(normalizedUser),
    fetchV3PositionsGraph(provider, normalizedUser),
  ]);

  return [...v2Positions, ...v3Positions];
}

// ==========================================
// 1. UNISWAP V2 IMPLEMENTATION
// ==========================================
async function fetchV2PositionsGraph(user: string): Promise<UniswapPosition[]> {
  const query = `
    {
      user(id: "${user}") {
        liquidityPositions {
          pair {
            id
            token0 { id decimals }
            token1 { id decimals }
            totalSupply
            reserve0
            reserve1
          }
          liquidityTokenBalance
        }
      }
    }
  `;

  try {
    const data = await graphQuery<UniswapV2GraphResponse>(V2_SUBGRAPH, query);
    if (!data.user) return [];

    return data.user.liquidityPositions.map((pos) => {
      const pair = pos.pair;
      const balance = parseFloat(pos.liquidityTokenBalance);
      const totalSupply = parseFloat(pair.totalSupply);

      const share = new SafeDecimal(balance).div(totalSupply);

      return {
        id: pair.id,
        dex: 'uniswap-v2' as const,
        base: getAddress(pair.token0.id),
        quote: getAddress(pair.token1.id),
        min: '0',
        max: 'Infinity',
        baseLiquidity: share.mul(pair.reserve0).toString(),
        quoteLiquidity: share.mul(pair.reserve1).toString(),
        baseFee: '0', // V2 fees are auto-compounded into liquidity
        quoteFee: '0',
        fee: '3000',
      };
    });
  } catch (error) {
    console.error('Error fetching V2 subgraph:', error);
    return [];
  }
}

export interface UniswapV3Tick {
  tickIdx: string; // The Graph returns Ints as strings often to be safe
}

export interface UniswapV3Pool {
  id: string;
  tick: string | null; // Current tick
  sqrtPrice: string; // X96 format
  feeTier: string; // e.g. "3000"
}

export interface UniswapV3Position {
  id: string; // NFT Token ID
  token0: GraphToken;
  token1: GraphToken;
  tickLower: UniswapV3Tick;
  tickUpper: UniswapV3Tick;
  liquidity: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  pool: UniswapV3Pool;
}

// Top-level response from The Graph
export interface UniswapV3GraphResponse {
  positions: UniswapV3Position[];
}

// ==========================================
// 2. UNISWAP V3 IMPLEMENTATION
// ==========================================
async function fetchV3PositionsGraph(
  provider: Provider,
  user: string,
): Promise<UniswapPosition[]> {
  const query = `
    {
      positions(where: { owner: "${user}" }) {
        id
        token0 { id decimals }
        token1 { id decimals }
        tickLower { tickIdx }
        tickUpper { tickIdx }
        liquidity
        feeGrowthInside0LastX128
        feeGrowthInside1LastX128
        pool {
          id
          tick
          sqrtPrice
          feeTier
        }
      }
    }
  `;

  try {
    const data = await graphQuery<UniswapV3GraphResponse>(V3_SUBGRAPH, query);
    if (!data.positions) return [];

    const getAll = data.positions.map(async (pos) => {
      // Calculate Liquidities
      const tickLower = Number(pos.tickLower.tickIdx);
      const tickUpper = Number(pos.tickUpper.tickIdx);

      const { amount0, amount1 } = estimateV3Amounts(
        pos.liquidity,
        pos.pool.sqrtPrice,
        tickLower,
        tickUpper,
        pos.pool.feeTier,
      );

      const fees = await getUniV3Fee(provider, pos.id, user);
      const baseDecimal = Number(pos.token0.decimals);
      const baseLiquidity = formatUnits(amount0, baseDecimal);
      const baseFee = formatUnits(fees.baseFee, baseDecimal);
      const quoteDecimal = Number(pos.token1.decimals);
      const quoteLiquidity = formatUnits(amount1, quoteDecimal);
      const quoteFee = formatUnits(fees.quoteFee, quoteDecimal);

      // Get Prices
      const priceLower = getTickPrice(pos.token0, pos.token1, tickLower);
      const priceUpper = getTickPrice(pos.token0, pos.token1, tickUpper);

      return {
        id: pos.id, // This is the NFT Token ID
        dex: 'uniswap-v3' as const,
        base: getAddress(pos.token0.id),
        quote: getAddress(pos.token1.id),
        min: priceLower,
        max: priceUpper,
        baseLiquidity: baseLiquidity,
        quoteLiquidity: quoteLiquidity,
        baseFee: baseFee,
        quoteFee: quoteFee,
        fee: pos.pool.feeTier,
      };
    });
    return Promise.all(getAll);
  } catch (error) {
    console.error('Error fetching V3 subgraph:', error);
    return [];
  }
}

export async function getUniV3Fee(
  provider: Provider,
  tokenId: bigint | string,
  user: string,
): Promise<{ baseFee: bigint; quoteFee: bigint }> {
  // Configuration
  const NONFUNGIBLE_POSITION_MANAGER =
    '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
  const MANAGER_ABI = [
    'function collect((uint256 tokenId, address recipient, uint128 amount0Max, uint128 amount1Max)) external payable returns (uint256 amount0, uint256 amount1)',
  ];
  const manager = new Contract(
    NONFUNGIBLE_POSITION_MANAGER,
    MANAGER_ABI,
    provider,
  );

  // MaxUint128 is used to request "all available fees"
  const MAX_UINT128 = 340282366920938463463374607431768211455n;

  // Params struct for the collect function
  const params = {
    tokenId: tokenId,
    recipient: user,
    amount0Max: MAX_UINT128,
    amount1Max: MAX_UINT128,
  };

  try {
    // staticCall simulates the transaction to get the return values without executing it
    const result = await manager.collect.staticCall(params);

    return {
      baseFee: result.amount0,
      quoteFee: result.amount1,
    };
  } catch (error) {
    console.error(`Failed to fetch fees for Token ID ${tokenId}:`, error);
    return { baseFee: 0n, quoteFee: 0n };
  }
}

/**
 * Estimates the amounts of Token0 and Token1 held in a V3 position
 * given its liquidity and the current pool state.
 */
export function estimateV3Amounts(
  liquidity: string,
  sqrtPriceX96: string,
  tickLower: number,
  tickUpper: number,
  feeTier: string | number,
): { amount0: string; amount1: string } {
  if (liquidity === '0') return { amount0: '0', amount1: '0' };

  // 1. Convert inputs to JSBI
  const liquidityJSBI = JSBI.BigInt(liquidity);
  const sqrtPriceX96JSBI = JSBI.BigInt(sqrtPriceX96);

  // 2. Normalize Fee (ensure it's a number)
  const fee = Number(feeTier);

  // 3. Calculate current tick
  const tickCurrent = TickMath.getTickAtSqrtRatio(sqrtPriceX96JSBI);

  // 4. Create Dummy Tokens: it doesn't matter which address it is
  const DUMMY_TOKEN_0 = new Token(
    ChainId.MAINNET,
    '0x0000000000000000000000000000000000000001',
    18,
  );
  const DUMMY_TOKEN_1 = new Token(
    ChainId.MAINNET,
    '0x0000000000000000000000000000000000000002',
    18,
  );

  // 5. Construct Pool with the CORRECT FEE
  // The SDK automatically maps the 'fee' to the correct 'tickSpacing'
  const pool = new Pool(
    DUMMY_TOKEN_0,
    DUMMY_TOKEN_1,
    fee,
    sqrtPriceX96JSBI,
    0,
    tickCurrent,
  );

  // 6. Create Position
  const position = new Position({
    pool,
    liquidity: liquidityJSBI,
    tickLower,
    tickUpper,
  });

  return {
    amount0: position.amount0.quotient.toString(),
    amount1: position.amount1.quotient.toString(),
  };
}

function getTickPrice(
  token0Data: { id: string; decimals: string },
  token1Data: { id: string; decimals: string },
  tick: number,
) {
  // 1. Create Token Entities (Needed for Decimal scaling)
  const token0 = new Token(
    ChainId.MAINNET,
    token0Data.id,
    Number(token0Data.decimals),
  );
  const token1 = new Token(
    ChainId.MAINNET,
    token1Data.id,
    Number(token1Data.decimals),
  );

  // 2. Get Price Object using SDK
  // Returns price of Token0 expressed in Token1
  const priceObject = tickToPrice(token0, token1, tick);

  // 3. Convert to Fixed Point String (18 decimals of precision)
  // We use 18 decimals so it's compatible with standard Solidity math (WAD)
  // If price is 1500 USDC (6 decimals) per ETH (18 decimals), this handles the shift.
  return priceObject.toFixed(18);
}

type CreateStrategyParams = Parameters<typeof carbonSDK.createBuySellStrategy>;

export const MigratePage = () => {
  const { user, provider, sendTransaction } = useWagmi();
  const [uniPositions, setUniPositions] = useState<UniswapPosition[]>([]);
  const { getTokenById } = useTokens();

  useEffect(() => {
    if (!user || !provider) return;
    getPositions(provider, user).then((positions) =>
      setUniPositions(positions),
    );
  }, [user, provider]);

  const tokens = useMemo(() => {
    if (!uniPositions.length) return;
    const list = new Set<string>();
    for (const position of uniPositions) {
      list.add(position.base);
      list.add(position.quote);
    }
    return Array.from(list);
  }, [uniPositions]);

  const marketPriceQuery = useGetMultipleTokenPrices(tokens);

  const positions = useMemo(() => {
    if (marketPriceQuery.isPending) return;
    const marketPrices = marketPriceQuery.data || {};
    return uniPositions.map((pos) => {
      const basePrice = new SafeDecimal(marketPrices[pos.base]);
      const quotePrice = new SafeDecimal(marketPrices[pos.quote]);
      return {
        id: pos.id,
        dex: dexNames[pos.dex],
        base: getTokenById(pos.base)!,
        quote: getTokenById(pos.quote)!,
        liquidity: basePrice
          .mul(pos.baseLiquidity)
          .add(quotePrice.mul(pos.quoteLiquidity)),
        feeLiquidity: basePrice
          .mul(pos.baseFee)
          .add(quotePrice.mul(pos.quoteFee)),
        feePercent: `${new SafeDecimal(pos.fee).div(1_000).toString()}%`,
        min: pos.min.toString(),
        max: pos.max.toString(),
      };
    });
  }, [
    getTokenById,
    marketPriceQuery.data,
    marketPriceQuery.isPending,
    uniPositions,
  ]);

  const migrateAll = async () => {
    if (!positions?.length) return;
    const marketPrices = marketPriceQuery.data || {};
    const transactions: TransactionRequest[] = [];
    // Withdraw existing positions

    // Create new strategies
    for (const pos of uniPositions) {
      const base = getTokenById(pos.base)!;
      const quote = getTokenById(pos.quote)!;
      const basePrice = new SafeDecimal(marketPrices[pos.base]);
      const quotePrice = new SafeDecimal(marketPrices[pos.quote]);
      const marketPrice = basePrice.div(quotePrice).toString();
      const spread = new SafeDecimal(pos.fee).div(1_000).toString();
      const isFullRange = pos.min === '0' && pos.max === 'Infinity';
      const fullrange = getFullRangesPrices(
        marketPrice,
        base.decimals,
        quote.decimals,
      );
      const min = isFullRange ? fullrange.min : pos.min;
      const max = isFullRange ? fullrange.max : pos.max;
      const prices = calculateOverlappingPrices(min, max, marketPrice, spread);
      const buyOrder = { min, marginalPrice: prices.buyPriceMarginal };
      const sellOrder = { max, marginalPrice: prices.sellPriceMarginal };
      const budgets = {
        sell: pos.baseLiquidity,
        buy: pos.quoteLiquidity,
      };
      if (isMinAboveMarket(buyOrder)) {
        budgets.sell = calculateOverlappingSellBudget(
          base.decimals,
          quote.decimals,
          min,
          max,
          marketPrice,
          spread,
          budgets.buy || '0',
        );
      } else if (isMaxBelowMarket(sellOrder)) {
        budgets.buy = calculateOverlappingBuyBudget(
          base.decimals,
          quote.decimals,
          min,
          max,
          marketPrice,
          spread,
          budgets.sell || '0',
        );
      }
      const params: CreateStrategyParams = [
        pos.base,
        pos.quote,
        prices.buyPriceLow,
        prices.buyPriceMarginal,
        prices.buyPriceHigh,
        budgets.buy,
        prices.sellPriceLow,
        prices.sellPriceMarginal,
        prices.sellPriceHigh,
        budgets.sell,
      ];
      const unsignedTx = await carbonSDK.createBuySellStrategy(...params);
      unsignedTx.customData = {
        spender: config.addresses.carbon.carbonController,
        assets: [
          {
            address: pos.base,
            rawAmount: pos.baseLiquidity,
          },
          {
            address: pos.quote,
            rawAmount: pos.quoteLiquidity,
          },
        ],
      };
      transactions.push(unsignedTx);
    }
    const tx = await sendTransaction(transactions);
    await tx.wait();
  };

  if (!positions) {
    return <CarbonLogoLoading className="h-80" />;
  }

  return (
    <table className="table grid-area-[list]">
      <thead>
        <tr>
          <th>Dex</th>
          <th>Pool</th>
          <th>Position</th>
          <th>Fees</th>
          <th>Pool fee tier</th>
          <th>Price range (Min)</th>
          <th>Price range (Max)</th>
          <th>
            <button className="btn-on-surface" onClick={migrateAll}>
              Migrate all
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {positions.map((position) => (
          <tr key={position.id}>
            <td>{position.dex}</td>
            <td>
              <TokensOverlap
                tokens={[position.base, position.quote]}
                size={32}
              />
            </td>
            <td>{getUsdPrice(position.liquidity)}</td>
            <td>{getUsdPrice(position.feeLiquidity)}</td>
            <td>{position.feePercent}</td>
            <td>{tokenAmount(position.min, position.quote)}</td>
            <td>{tokenAmount(position.max, position.quote)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
