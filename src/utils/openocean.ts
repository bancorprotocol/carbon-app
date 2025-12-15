import config from 'config';
const apiUrl = `https://open-api.openocean.finance/v4/${config.network.chainId}/`;

// TODO: implement with cloudflare function
const get = async <T>(
  endpoint: string,
  params: object = {},
  abortSignal?: AbortSignal,
): Promise<T> => {
  const url = new URL(apiUrl + endpoint);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  }
  url.searchParams.set('referrer', config.addresses.carbon.vault);
  url.searchParams.set('referrerFee', '0.25');
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

export const openocean = {
  quote: (params: QuoteParams) => get<OpenOceanQuoteResult>('quote', params),
  reverseQuote: (params: QuoteParams) =>
    get<OpenOceanQuoteResult>('reverseQuote', params),
  swap: (params: SwapParams) => get<OpenOceanSwapResult>('swap', params),
  gasPrice: async () => {
    const result = await get<GasPriceResult>('gasPrice');
    if (typeof result.standard === 'number') return result.standard;
    return result.standard.maxPriorityFeePerGas;
  },
};
