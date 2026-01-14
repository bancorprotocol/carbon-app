import { useEffect, useState } from 'react';
import { Provider, Contract, MaxUint256 } from 'ethers';
import { useWagmi } from 'libs/wagmi';
import { Pool, Position, TickMath, FeeAmount } from '@uniswap/v3-sdk';
import { Token, ChainId } from '@uniswap/sdk-core';
import JSBI from 'jsbi';

// --- Configuration ---
const UNI_V3_MANAGER = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
const V3_FACTORY = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const V2_SUBGRAPH_URL =
  'https://gateway.thegraph.com/api/subgraphs/id/EYCKATKGBKLWvSfwvBjzfCBmGwYNdVkduYXVivCsLRFu';

// --- ABIs ---
const V2_PAIR_ABI = [
  'function balanceOf(address owner) view returns (uint)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function totalSupply() view returns (uint)',
];

const V3_MANAGER_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
];

const V3_POOL_ABI = [
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
];

const V3_FACTORY_ABI = [
  'function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)',
];

// --- Interface ---
export interface UniswapPosition {
  id: string;
  dex: 'uniswap-v2' | 'uniswap-v3';
  base: string;
  quote: string;
  minPrice: bigint;
  maxPrice: bigint;
  baseLiquidity: bigint;
  quoteLiquidity: bigint;
  baseFee: bigint;
  quoteFee: bigint;
}

/**
 * CONSOLIDATED GET POSITIONS (No API Key Version)
 */
export async function getPositions(
  provider: Provider,
  userAddress: string,
): Promise<UniswapPosition[]> {
  const positions: UniswapPosition[] = [];

  // ==========================================
  // 1. UNISWAP V2 DISCOVERY (Via The Graph)
  // ==========================================
  try {
    // 1. Get potential pairs from Subgraph (Free, Public)
    const v2Pairs = await fetchV2PairsViaSubgraph(userAddress);

    // 2. Verify on-chain to ensure data is live
    for (const pairInfo of v2Pairs) {
      const pairContract = new Contract(pairInfo.id, V2_PAIR_ABI, provider);

      // Check live balance (Subgraph might be a few blocks behind)
      const balance: bigint = await pairContract.balanceOf(userAddress);

      if (balance > 0n) {
        const [reserves, totalSupply] = await Promise.all([
          pairContract.getReserves(),
          pairContract.totalSupply(),
        ]);

        // Calculate User Share
        const amount0 = (balance * BigInt(reserves.reserve0)) / totalSupply;
        const amount1 = (balance * BigInt(reserves.reserve1)) / totalSupply;

        positions.push({
          dex: 'uniswap-v2',
          base: pairInfo.token0.id, // We already got this from subgraph, saves an RPC call
          quote: pairInfo.token1.id,
          minPrice: 0n,
          maxPrice: MaxUint256,
          baseLiquidity: amount0,
          quoteLiquidity: amount1,
          baseFee: 0n,
          quoteFee: 0n,
          id: pairInfo.id,
        });
      }
    }
  } catch (error) {
    console.warn('V2 Discovery failed:', error);
  }

  // ==========================================
  // 2. UNISWAP V3 DISCOVERY (On-Chain)
  // ==========================================
  try {
    const manager = new Contract(UNI_V3_MANAGER, V3_MANAGER_ABI, provider);
    const factory = new Contract(V3_FACTORY, V3_FACTORY_ABI, provider);

    const balance = await manager.balanceOf(userAddress);

    for (let i = 0; i < Number(balance); i++) {
      const tokenId: bigint = await manager.tokenOfOwnerByIndex(userAddress, i);
      const pos = await manager.positions(tokenId);

      if (
        pos.liquidity === 0n &&
        pos.tokensOwed0 === 0n &&
        pos.tokensOwed1 === 0n
      )
        continue;

      const poolAddress = await factory.getPool(
        pos.token0,
        pos.token1,
        pos.fee,
      );
      const poolContract = new Contract(poolAddress, V3_POOL_ABI, provider);
      const slot0 = await poolContract.slot0();

      const { amount0, amount1 } = estimateV3Amounts(
        pos.liquidity,
        slot0.sqrtPriceX96,
        pos.tickLower,
        pos.tickUpper,
      );

      positions.push({
        dex: 'uniswap-v3',
        base: pos.token0,
        quote: pos.token1,
        minPrice: BigInt(pos.tickLower),
        maxPrice: BigInt(pos.tickUpper),
        baseLiquidity: amount0,
        quoteLiquidity: amount1,
        baseFee: pos.tokensOwed0,
        quoteFee: pos.tokensOwed1,
        id: tokenId.toString(),
      });
    }
  } catch (error) {
    console.error('V3 Discovery failed:', error);
  }

  return positions;
}

// --- HELPER: GRAPHQL QUERY ---

interface UniswapV2User {
  liquidityPositions: {
    pair: {
      id: string;
      token0: { id: string };
      token1: { id: string };
    };
    liquidityTokenBalance: string;
  }[];
}

/**
 * Queries the official Uniswap V2 Subgraph to find pairs where the user has liquidity.
 * Returns an array of pair objects { id, token0: { id }, token1: { id } }
 */
async function fetchV2PairsViaSubgraph(userAddress: string) {
  const query = `
    {
      user(id: "${userAddress.toLowerCase()}") {
        liquidityPositions {
          pair {
            id
            token0 { id }
            token1 { id }
          }
          liquidityTokenBalance
        }
      }
    }
  `;

  const response = await fetch(V2_SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUBGRAPH_APIKEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const json = await response.json<{ data: { user: UniswapV2User } }>();

  if (!json.data || !json.data.user) return [];

  // Filter out positions where subgraph thinks balance is 0
  // We map to return just the pair structure needed by the main function
  return json.data.user.liquidityPositions
    .filter((pos: any) => parseFloat(pos.liquidityTokenBalance) > 0)
    .map((pos: any) => pos.pair);
}

/**
 * Estimates the amounts of Token0 and Token1 held in a V3 position
 * given its liquidity and the current pool state.
 */
export function estimateV3Amounts(
  liquidity: bigint,
  sqrtPriceX96: bigint,
  tickLower: number,
  tickUpper: number,
): { amount0: bigint; amount1: bigint } {
  if (liquidity === 0n) return { amount0: 0n, amount1: 0n };

  // 1. Convert Ethers BigInt to JSBI (required by SDK)
  const liquidityJSBI = JSBI.BigInt(liquidity.toString());
  const sqrtPriceX96JSBI = JSBI.BigInt(sqrtPriceX96.toString());

  // 2. Calculate current tick from sqrtPriceX96
  const tickCurrent = TickMath.getTickAtSqrtRatio(sqrtPriceX96JSBI);

  // 3. Create Dummy Tokens (Metadata doesn't affect amount calculation)
  // We use Mainnet ChainId and standard 18 decimals as placeholders
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

  // 4. Construct a "Virtual" Pool
  // We only need the current price/tick and liquidity to calculate amounts.
  // Fee is arbitrary here as it doesn't change the principal amount logic.
  const pool = new Pool(
    DUMMY_TOKEN_0,
    DUMMY_TOKEN_1,
    FeeAmount.MEDIUM, // 0.3%
    sqrtPriceX96JSBI,
    0, // Pool liquidity (unused for position calculation)
    tickCurrent,
  );

  // 5. Create the Position Entity
  // The SDK automatically calculates the breakdown of amount0/amount1 based on
  // where tickCurrent is relative to tickLower/tickUpper.
  const position = new Position({
    pool,
    liquidity: liquidityJSBI,
    tickLower,
    tickUpper,
  });

  // 6. Extract Amounts and convert back to BigInt
  // amount0 and amount1 are CurrencyAmount objects
  return {
    amount0: BigInt(position.amount0.quotient.toString()),
    amount1: BigInt(position.amount1.quotient.toString()),
  };
}

export const MigratePage = () => {
  const { user, provider } = useWagmi();
  const [positions, setPositions] = useState<UniswapPosition[]>([]);

  useEffect(() => {
    if (!provider || !user) return;
    getPositions(provider, user).then((positions) => setPositions(positions));
  }, [user, provider]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Dex</th>
          <th>Pool</th>
          <th>Position</th>
          <th>Fees</th>
          <th>Pool fee tier</th>
          <th>Price range (Min)</th>
          <th>Price range (Max)</th>
        </tr>
      </thead>
      <tbody>
        {positions.map((position) => (
          <tr key={position.id}>
            <td>{position.dex}</td>
            <td>
              {position.base} / {position.quote}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
