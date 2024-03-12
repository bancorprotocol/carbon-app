import {
  SimulatorAPIParams,
  SimulatorResult,
} from 'libs/queries/extApi/simulator';
import {
  TokenPriceHistoryResult,
  TokenPriceHistorySearch,
} from 'libs/queries/extApi/tokenPrice';
import config from 'config';

export const AVAILABLE_CURRENCIES = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'ETH',
] as const;

export type FiatSymbol = (typeof AVAILABLE_CURRENCIES)[number];

export type FiatPriceDict = {
  [k in FiatSymbol]: number;
};

export type RoiRow = {
  ROI: string;
  id: string;
};

const get = async <T>(endpoint: string, params: Object = {}): Promise<T> => {
  const url = new URL(config.carbonApi + endpoint);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const response = await fetch(url);
  const result = (await response.json()) as T & { error?: string };

  if (!response.ok)
    throw new Error(
      result?.error ||
        `Response was not okay. ${response.statusText} response received.`
    );
  return result;
};

const carbonApi = {
  getCheck: async (): Promise<boolean> => {
    if (config.mode === 'development') return false;
    return fetch(`/api/check`).then((res) => res.json());
  },
  getMarketRate: async (
    address: string,
    convert: readonly FiatSymbol[]
  ): Promise<FiatPriceDict> => {
    const { data } = await get<{ data: FiatPriceDict }>('market-rate', {
      address,
      convert: convert.join(','),
    });
    return data;
  },
  getMarketRateHistory: async (
    params: TokenPriceHistorySearch
  ): Promise<TokenPriceHistoryResult[]> => {
    const data = await get<TokenPriceHistoryResult[]>('history/prices', params);
    return data;
  },
  getRoi: async (): Promise<RoiRow[]> => {
    const data = await get<RoiRow[]>('roi');
    return data;
  },
  getSimulator: async (
    params: SimulatorAPIParams
  ): Promise<SimulatorResult> => {
    const data = await get<SimulatorResult>('simulate-create-strategy', {
      ...params,
      baseBudget: params.sellBudget,
      quoteBudget: params.buyBudget,
    });
    return data;
  },
};

export { carbonApi };
