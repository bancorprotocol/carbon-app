import { Contract, formatUnits, getAddress, Provider } from 'ethers';
import { graphQuery, GraphToken, UniswapPosition } from '../utils';
import { Pool, Position, TickMath, tickToPrice } from '@uniswap/v3-sdk';
import { Token, ChainId } from '@uniswap/sdk-core';
import JSBI from 'jsbi';

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

const apikey = import.meta.env.VITE_SUBGRAPH_APIKEY;
const V3_SUBGRAPH = `https://gateway.thegraph.com/api/${apikey}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

export async function fetchV3PositionsGraph(
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
