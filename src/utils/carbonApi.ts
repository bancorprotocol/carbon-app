import axios from 'axios';
import {
  SimulatorAPIParams,
  SimulatorReturnNew,
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

const newApiAxios = axios.create({
  baseURL: config.carbonApi,
});

const carbonApi = {
  getCheck: async (): Promise<boolean> => {
    if (config.mode === 'development') return false;
    const localApi = axios.create({ baseURL: '/api/' });
    const { data } = await localApi.get<boolean>('/check');
    return data;
  },
  getMarketRate: async (
    address: string,
    convert: readonly FiatSymbol[]
  ): Promise<FiatPriceDict> => {
    const {
      data: { data },
    } = await newApiAxios.get<{ data: FiatPriceDict }>(`market-rate`, {
      params: { address, convert: convert.join(',') },
    });
    return data;
  },
  getMarketRateHistory: async (
    params: TokenPriceHistorySearch
  ): Promise<TokenPriceHistoryResult[]> => {
    const { data } = await newApiAxios.get<TokenPriceHistoryResult[]>(
      `history/prices`,
      { params }
    );
    return data;
  },
  getRoi: async (): Promise<RoiRow[]> => {
    const { data } = await newApiAxios.get<RoiRow[]>('roi');
    return data;
  },
  getSimulator: async (
    params: SimulatorAPIParams
  ): Promise<SimulatorReturnNew> => {
    const { data } = await newApiAxios.get<SimulatorReturnNew>(
      'simulator/create',
      {
        params,
      }
    );
    return data;
  },
};

export { carbonApi };
