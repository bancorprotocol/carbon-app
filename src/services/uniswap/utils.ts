export type Dexes = `${'uniswap' | 'sushi' | 'pancake'}-${'v2' | 'v3'}`;

export interface GraphToken {
  id: string; // Address
  decimals: string; // Often returned as string, requires parsing
  symbol?: string; // Optional if you add it to query later
}

interface GraphQLResponse<T> {
  errors: any;
  data: T;
}

export async function graphQuery<T>(url: string, query: string) {
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
  min: string; // TickLower (V3) or "0" (V2)
  max: string; // TickUpper (V3) or "Infinity" (V2)
  baseLiquidity: string; // Amount of Token0
  quoteLiquidity: string; // Amount of Token1
  baseFee: string; // Uncollected Fees Token0
  quoteFee: string; // Uncollected Fees Token1
  fee: string; // Fee Tier (e.g. "3000" for 0.3%)
}

export interface UniswapV2Config {
  dex: Dexes;
  factoryAddress: string;
  routerAddress: string;
  startBlock: number;
  fee: string;
}

export interface UniswapV3Config {
  dex: Dexes;
  factoryAddress: string;
  managerAddress: string;
}
