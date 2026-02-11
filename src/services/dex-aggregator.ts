import { PopulatedTransaction } from '@bancor/carbon-sdk';

const getResponse = (params: object, abortSignal?: AbortSignal) => {
  if (import.meta.env.DEV) {
    const url = import.meta.env.VITE_DEX_AGGREGATOR_URL + '/quote';
    const apiKey = import.meta.env.VITE_DEX_AGGREGATOR_APIKEY;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      signal: abortSignal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  } else {
    // In production send to cloudflare proxy
    const url = new URL(location.origin + '/api/dex-aggregator');
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    return fetch(url, { signal: abortSignal });
  }
};

const get = async <T>(
  params: object = {},
  abortSignal?: AbortSignal,
): Promise<T> => {
  const response = await getResponse(params, abortSignal);
  const result = await response.json<T>();
  if (!response.ok) {
    const error = (result as { error?: string }).error;
    throw new Error(
      error ||
        `Response was not okay. ${response.statusText} response received.`,
    );
  }
  return result;
};

interface QuoteParams {
  chainId: number;
  sourceToken: string;
  targetToken: string;
  amount: string;
  tradeBySource: boolean;
  slippage: number;
}

interface SwapParams extends QuoteParams {
  recipient: string;
  quoteId: string;
}

/** Quote is found */
interface QuoteFoundResult {
  id: string;
  tradeFound: true;
  sourceAmount: string;
  targetAmount: string;
  metadata: QuoteMetadata[];
  slippage: number;
  allowanceRequired: string;
}
/** Quote is not found */
interface QuoteNotFoundResult {
  id: string;
  tradeFound: false;
}
type QuoteResult = QuoteFoundResult | QuoteNotFoundResult;

/** Quote is found and it returns the transaction information */
interface SwapResult extends QuoteFoundResult {
  validated: boolean;
  gasEstimate: string;
  tx: PopulatedTransaction;
  confirmNewQuote: boolean;
}

export interface QuoteMetadata {
  percentage: number;
  sourceToken: string;
  targetToken: string;
  amountIn: string;
  amountOut: string;
  exchange: ExchangeKey & 'Unwrap';
}

export const exchangeNames = {
  'carbon-OG': 'Carbon V1',
  'vortex-v2-eth': 'Vortex V2',
  'vortex-v2-sei': 'Vortex V2',
  'vortex-v2-celo': 'Vortex V2',
  'vortex-v2-base': 'Vortex V2',
  'vortex-v2-mantle': 'Vortex V2',
  'vortex-v2-linea': 'Vortex V2',
  'vortex-v2-blast': 'Vortex V2',
  'vortex-v2-velocimeter-iota': 'Vortex V2 Velocimeter',
  'vortex-v2-velocimeter-base': 'Vortex V2 Velocimeter',
  'vortex-v2-velocimeter-mantle': 'Vortex V2 Velocimeter',
  'vortex-v2-velocimeter-bera': 'Vortex V2 Velocimeter',
  'carbon-sei': 'Carbon',
  'carbon-celo': 'Carbon',
  velocimeter: 'Velocimeter',
  'uniswap-OG': 'Uniswap V3',
  'uniswap-celo': 'Uniswap V3',
  'uniswap-v2': 'Uniswap V2',
  agni: 'Agni',
  'sushi-OG': 'Sushi V3',
  'sushi-v2': 'Sushi V2',
  pancake: 'Pancake',
  'pancake-v2': 'Pancake V2',
  butter: 'Butter',
  cleopatra: 'Cleo',
  fusionx: 'Fusion X',
  'uniswap-v3-sei-unknown': 'Uni V3',
  dragonswap: 'Dragonswap',
  'dragonswap-v3': 'Dragonswap V3',
  supernova: 'Supernova',
  merchantmoe: 'Merchantmoe',
  'fusionx-v2': 'Fusion X V2',
  oku: 'O K U',
  'uniswap-v2-sei-unknown': 'Uni V2',
  'stratum-v2': 'Stratum V2',
  ubeswap: 'Ubeswap',
  'sushi-celo': 'Sushi V2',
  'xei-sei': 'Xei',
  'thruster-v2-30': 'Thruster V230',
  'thruster-v2-100': 'Thruster V2100',
  'thruster-v3': 'Thruster V3',
  'ringswap-v2': 'Ringswap V2',
  'ringswap-v3': 'Ringswap V3',
  'blasterswap-v2': 'Blasterswap V2',
  'blasterswap-v3': 'Blasterswap V3',
  'dyor-v2': 'Dyor V2',
  'roguex-v3': 'Rogue X',
  'monoswap-v2': 'Monoswap2',
  'monoswap-v3': 'Monoswap V3',
  'fenix-carbon': 'Fenix Carbon',
  'uniswap-blast': 'Uniswap V3',
  'alien-base-v2': 'Alien Base V2',
  'alien-base-v3': 'Alien Base V3',
  'alien-base-carbon': 'Alien Base Carbon',
  'aerodrome-base': 'Aerodrome',
  'baseswap-v2': 'Base Swap V2',
  'baseswap-v3': 'Base Swap V3',
  'graphene-base': 'Graphene Base',
  'pancake-v2-base': 'Pancake V2',
  'pancake-v3-base': 'Pancake V3',
  'sushi-v2-base': 'Sushi V2',
  'sushi-v3-base': 'Sushi V3',
  'swapbased-v2': 'Swapbased V2',
  'uni-v2-base': 'Uni V2',
  'uni-v3-base': 'Uni V3',
  'hyperjump-v2': 'Hyperjump V2',
  'knightswap-v2': 'Knightswap V2',
  'soulswap-v2': 'Soulswap V2',
  'spookyswap-v2': 'Spookyswap V2',
  'wigoswap-v2': 'Wigoswap V2',
  'echodex-v3': 'Echodex V3',
  'metavault-v2': 'Metavault V2',
  'metavault-v3': 'Metavault V3',
  'pancake-v3-linea': 'Pancake V3',
  'secta-v2': 'Secta V2',
  'secta-v3': 'Secta V3',
  'xfai-carbon': 'X Fai Carbon',
  xfai: 'X FAI',
  'ubeswap-v3-celo': 'Ubeswap V3',
  'graphene-iota': 'Graphene',
  'magicsea-v2-iota': 'Magicsea V2',
  'velocimeter-solidly-iota': 'Velocimeter Solidlt',
  'wagmi-v3-iota': 'Wagmi V3',
  'vortex-v2-iota': 'Vortex V2',
  'donkeswap-sei': 'Donke Swap',
  'bancor-v3-ethereum': 'Bancor V3',
  'bancor-v2-ethereum': 'Bancor V2',
  'kodiak-v2-bera': 'Bera Kodiak V2',
  'bera-uni-v2-unknown1': 'Bera Uni V2',
  'memeswap-v2-bera': 'Bera Memeswap V2',
  'forestbear-v2-bera': 'Bera Forest Bear V2',
  'kodiak-v3-bera': 'Bera Kodiak V3',
  'carbon-bera-velocimeter': 'Carbon Bera Velocimeter',
  'sailor-finance-sei': 'Sailor Finance',
  'carbon-sonic-velocimeter': 'Carbon Sonic Velocimeter',
  'wagmi-v3-sonic': 'Wagmi V3 Sonic',
  'oku-sonic': 'Oku Sonic',
  'metropolis-v2-sonic': 'Metropolis V2 Sonic',
  'shadow-v3-sonic': 'Shadow Sonic V3',
  'shadow-v2-sonic': 'Shadow Sonic V2',
  'defive-v2-sonic': 'De Five Sonic V2',
  'spookyswap-v2-sonic': 'Spookyswap Sonic V2',
  'spookyswap-v3-sonic': 'Spookyswap Sonic V3',
  'nile-cl-linea': 'Nile C L',
  'scale-base': 'Scale',
  'lynex-v1-linea': 'Lynex V1',
  'nile-legacy-linea': 'Nile Legacy',
  'carbon-coti': 'Carbon Coti',
  'uniswap-v4-ethereum': 'Uniswap V4',
  'uniswap-v4-base': 'Uniswap V4',
  'uniswap-v4-blast': 'Uniswap V4',
  'uniswap-v4-arbitrum': 'Uniswap V4',
  'carbon-arbitrum': 'Carbon Arb',
  'uniswap-v3-arbitrum': 'Arb Uniswap V3',
  'sushiswap-v3-arbitrum': 'Arb Sushiswap V3',
  'pancakeswap-v3-arbitrum': 'Arb Pancakeswap V3',
  'uniswap-v2-arbitrum': 'Arb Uniswap V2',
  'sushiswap-v2-arbitrum': 'Arb Sushiswap V2',
  'pancakeswap-v2-arbitrum': 'Arb Pancakeswap V2',
  'kalaeidocube-v2-arbitrum': 'Arb Kaleido Cube',
  'arbswap-v2-arbitrum': 'Arb Arbswap V2',
  'spatradex-v2-arbitrum': 'Arb Spartadex V2',
  'zyberswap-v2-arbitrum': 'Arb Zyberswap V2',
  'vortex-v2-bera': 'Vortex V2',
  'curve-ethereum': 'Curve',
  'camelot-v4-arbitrum': 'Camelot V4',
  'carbon-tac': 'Carbon Tac',
  'vortex-v2-coti': 'Vortex V2',
  'vortex-v2-tac': 'Vortex V2',
  'curve-tac': 'Curve Tac',
  'yaka-solidly-sei': 'Yaka Finance',
  'carbon-dna-bnb': 'Carbon Dna',
  'uni-v2-bnb': 'Uni V2',
  'pancake-v2-bnb': 'Pancake V2',
  'uni-v3-bnb': 'Uni V3',
  'pancake-v3-bnb': 'Pancake V3',
  'curve-base': 'Curve Base',
  'curve-arbitrum': 'Curve Arb',
  'curve-sonic': 'Curve Sonic',
  'curve-celo': 'Curve Celo',
  'snap-algebra-tac': 'Snap Algebra',
  'snap-solidly-tac': 'Snap Solidly',
  'mento-celo': 'Mento',
  'curve-bnb': 'Curve',
  'uni-v3-mantle': 'Uniswap V3',
};
type ExchangeKey = keyof typeof exchangeNames;

export const dexAggregator = {
  quote: async (params: QuoteParams) => get<QuoteResult>(params),
  // TODO: add recipient
  swap: async (params: SwapParams) => get<SwapResult>(params),
};
