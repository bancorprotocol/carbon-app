import {
  SimulatorAPIParams,
  SimulatorReturnNew,
} from 'libs/queries/extApi/simulator';
import {
  TokenPriceHistoryResult,
  TokenPriceHistorySearch,
} from 'libs/queries/extApi/tokenPrice';
import config from 'config';
import {
  QueryActivityParams,
  ServerActivity,
} from 'libs/queries/extApi/activity';
import { lsService } from 'services/localeStorage';

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
  const api = lsService.getItem('carbonApi') || config.carbonApi;
  const url = new URL(api + endpoint);
  for (const [key, value] of Object.entries(params)) {
    value !== 'undefined' && url.searchParams.set(key, value);
  }
  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    const error = (result as { error?: string }).error;
    throw new Error(
      error ||
        `Response was not okay. ${response.statusText} response received.`
    );
  }
  return result as T;
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
    return get<TokenPriceHistoryResult[]>('history/prices', params);
  },
  getRoi: async (): Promise<RoiRow[]> => {
    return get<RoiRow[]>('roi');
  },
  getSimulator: async (
    params: SimulatorAPIParams
  ): Promise<SimulatorReturnNew> => {
    return get<SimulatorReturnNew>('simulator/create', params);
  },
  getActivity: async (params: QueryActivityParams) => {
    return get<ServerActivity[]>('activity', params);
  },
};

export { carbonApi };
