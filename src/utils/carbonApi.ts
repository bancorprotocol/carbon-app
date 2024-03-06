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

const fetchGetToJson = <T>(url: string, params?: Object): Promise<T> => {
  const isRelativeUrl = url.startsWith('/');
  const urlAbsolute = new URL(`${isRelativeUrl ? '' : config.carbonApi}` + url);

  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      urlAbsolute.searchParams.append(k, v)
    );
  }

  return fetch(urlAbsolute, { method: 'GET' }).then((response) =>
    response.json()
  );
};

const carbonApi = {
  getCheck: async (): Promise<boolean> => {
    if (config.mode === 'development') return false;
    const data = await fetchGetToJson<boolean>(`/api/check`);
    return data;
  },
  getMarketRate: async (
    address: string,
    convert: readonly FiatSymbol[]
  ): Promise<FiatPriceDict> => {
    const { data } = await fetchGetToJson<{ data: FiatPriceDict }>(
      'market-rate',
      {
        address,
        convert: convert.join(','),
      }
    );
    return data;
  },
  getMarketRateHistory: async (
    params: TokenPriceHistorySearch
  ): Promise<TokenPriceHistoryResult[]> => {
    const data = await fetchGetToJson<TokenPriceHistoryResult[]>(
      'history/prices',
      params
    );
    return data;
  },
  getRoi: async (): Promise<RoiRow[]> => {
    const data = await fetchGetToJson<RoiRow[]>('roi');
    return data;
  },
  getSimulator: async (
    params: SimulatorAPIParams
  ): Promise<SimulatorResult> => {
    const data = await fetchGetToJson<SimulatorResult>(
      'simulate-create-strategy',
      {
        ...params,
        baseBudget: params.sellBudget,
        quoteBudget: params.buyBudget,
      }
    );
    return data;
  },
};

export { carbonApi };
