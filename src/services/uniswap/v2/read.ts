import { SafeDecimal } from 'libs/safedecimal';
import { graphQuery, GraphToken, UniswapPosition } from '../utils';
import { getAddress } from 'ethers';

const apikey = import.meta.env.VITE_SUBGRAPH_APIKEY;
const V2_SUBGRAPH = `https://gateway.thegraph.com/api/${apikey}/subgraphs/id/A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum`;

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

export async function fetchV2PositionsGraph(
  user: string,
): Promise<UniswapPosition[]> {
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
