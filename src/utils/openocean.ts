import config from 'config';
import { NATIVE_TOKEN_ADDRESS } from './tokens';
const apiUrl = `https://open-api.openocean.finance/v4/${config.network.chainId}/`;

const getUrl = (endpoint: string) => {
  if (import.meta.env.DEV) {
    return new URL(apiUrl + endpoint);
  } else {
    // In production send to cloudflare proxy
    const url = new URL(location.origin + '/api/openocean');
    url.searchParams.set('endpoint', endpoint);
    url.searchParams.set('chain', config.network.chainId.toString());
    return url;
  }
};

const get = async <T>(
  endpoint: string,
  params: object = {},
  abortSignal?: AbortSignal,
): Promise<T> => {
  const url = getUrl(endpoint);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, { signal: abortSignal });
  const result = await response.json();
  if (!response.ok) {
    const error = (result as { error?: string }).error;
    throw new Error(
      error ||
        `Response was not okay. ${response.statusText} response received.`,
    );
  }
  return (result as { data: T }).data;
};

interface QuoteParams {
  /** Base */
  inTokenAddress: string;
  /** Quote */
  outTokenAddress: string;
  /** Token amount with decimals. For example, if 1 USDT is input, use 1000000 (1 USDT * 10^6) */
  amountDecimals: string;
  /** GasPrice with decimals */
  gasPriceDecimals: string;
  /** Define the acceptable slippage level by inputting a percentage value within the range of 0.05 to 50. e.g. 1% slippage set as 1 default value 1 */
  slippage?: number;
  /** Enter the 'index' number of dexs through dexList endpoint to disable single or multiple dexs separated by commas, e.g. disabledDexIds: "2,6,9".*/
  disabledDexIds?: string;
  /** Enter the 'index' number of dexs through dexList. P.S. enabledDexIds has higher priority compared with disabledDexIds */
  enabledDexIds?: string;
}

interface SwapParams extends QuoteParams {
  /**
   * An EOA wallet address used to identify partners and optionally receive a fee from users.
   * If no fee is set up, it serves purely as a tracking tool to help our dev team provide better support and insights
   */
  referrer?: string;
  /**
   * Specify the percentage of in-token you wish to receive from the transaction, within the range of 0% to 5%, with 1% represented as '1', in the range of 0.01 to 5.
   * e.g. 1.2% fee set as 1.2
   * By default, OpenOcean shares 20% of the fee. Please contact us if you wish to modify this rate.
   */
  referrerFee?: string;
  /** The caller address.
   * Token Delivery Logic
   * If a sender address is specified, the sender address will be set as sender(caller), and account address will be set as receiver.
   * If no sender address is specified, the account address will automatically be set as the sender(caller) and receiver.
   */
  sender?: string;
  /**
   * The minimum amount of target tokens the user expects to receive.
   * minOutput with decimals. For example, if 9.9 USDT is minOutput, use 9900000 (9.9 USDT * 10^6).
   */
  minOutput?: number;
  /** Wallet address */
  account?: string;
}

interface OpenOceanSwapToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  usd: string;
  volume: number;
}
interface OpenOceanSwapDex {
  dexIndex: number;
  dexCode: string;
  swapAmount: string;
}
export interface OpenOceanSwapPath {
  from: string;
  to: string;
  parts: number;
  routes: OpenOceanSwapRoutes[];
}
interface OpenOceanSwapRoutes {
  parts: number;
  percentage: number;
  subRoutes: OpenOceanSwapSubRoutes[];
}
interface OpenOceanSwapSubRoutes {
  from: string;
  to: string;
  parts: number;
  dexes: {
    dex: string;
    id: string;
    parts: number;
    percentage: number;
    fee?: number;
  }[];
}

interface OpenOceanQuoteResult {
  inToken: OpenOceanSwapToken;
  outToken: OpenOceanSwapToken;
  inAmount: string;
  outAmount: string;
  estimatedGas: string;
  dexes: OpenOceanSwapDex[];
  path: OpenOceanSwapPath;
  save: number;
  price_impact: string;
  exchange: string;
}

interface OpenOceanSwapResult {
  inToken: OpenOceanSwapToken;
  outToken: OpenOceanSwapToken;
  inAmount: string;
  outAmount: string;
  estimatedGas: number;
  minOutAmount: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  data: string;
  chainId: number;
  rfqDeadline: number;
  gmxFee: number;
  price_impact: string;
}

interface GasPriceEth {
  legacyGasPrice: number;
  maxPriorityFeePerGas: number;
  maxFeePerGas: number;
  waitTimeEstimate: number;
}
interface GasPriceResult {
  standard: number | GasPriceEth;
  fast: number | GasPriceEth;
  instant: number | GasPriceEth;
}

// Replace native tokens with the once here: https://apis.openocean.finance/developer/apis/supported-chains
const nativeTokenList = {
  // ETH
  1: {
    from: NATIVE_TOKEN_ADDRESS,
    to: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
  // Celo
  42220: {
    from: NATIVE_TOKEN_ADDRESS,
    to: '0x471EcE3750Da237f93B8E339c536989b8978a438',
  },
  // Sei
  1329: {
    from: NATIVE_TOKEN_ADDRESS,
    to: '0x0000000000000000000000000000000000000000',
  },
  // Tac
  239: {
    from: NATIVE_TOKEN_ADDRESS,
    to: '0x0000000000000000000000000000000000000000',
  },
};

const nativeToken =
  nativeTokenList[config.network.chainId as keyof typeof nativeTokenList];

const replaceNativeTokenParams = (params: QuoteParams) => {
  if (nativeToken) {
    if (params.inTokenAddress === nativeToken.from) {
      params.inTokenAddress = nativeToken.to;
    }
    if (params.outTokenAddress === nativeToken.from) {
      params.outTokenAddress = nativeToken.to;
    }
  }
  return params;
};

const replaceNativeTokenQuoteResult = (result: OpenOceanQuoteResult) => {
  if (result.path.from === nativeToken.to) {
    result.path.from = nativeToken.from;
  }
  if (result.path.to === nativeToken.to) {
    result.path.to = nativeToken.from;
  }
  for (const route of result.path.routes) {
    for (const subRoute of route.subRoutes) {
      if (subRoute.from === nativeToken.to) {
        subRoute.from = nativeToken.from;
      }
      if (subRoute.to === nativeToken.to) {
        subRoute.to = nativeToken.from;
      }
    }
  }
  return result;
};

export const openocean = {
  quote: async (params: QuoteParams) => {
    const sanitized = replaceNativeTokenParams(params);
    const result = await get<OpenOceanQuoteResult>('quote', sanitized);
    return replaceNativeTokenQuoteResult(result);
  },
  reverseQuote: async (params: QuoteParams) => {
    const sanitized = replaceNativeTokenParams(params);
    const result = await get<OpenOceanQuoteResult>('reverseQuote', sanitized);
    return replaceNativeTokenQuoteResult(result);
  },
  swap: async (params: SwapParams) => {
    const sanitized = replaceNativeTokenParams(params);
    return get<OpenOceanSwapResult>('swap', sanitized);
  },
  gasPrice: async () => {
    const { standard } = await get<GasPriceResult>('gasPrice');
    if (typeof standard === 'number') {
      return standard;
    } else {
      return standard.legacyGasPrice;
    }
  },
};
