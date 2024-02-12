import axios from 'axios';
import { SimulatorResult } from 'libs/queries/extApi/simulator';
import {
  TokenPriceHistoryResult,
  TokenPriceHistorySearch,
} from 'libs/queries/extApi/tokenPrice';
import { SimulatorResultSearch } from 'libs/routing';
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
    const baseURL = config.appUrl + '/api/';
    const { data } = await axios.create({ baseURL }).get<boolean>('/check');
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
    params: SimulatorResultSearch
  ): Promise<SimulatorResult> => {
    const { data } = await newApiAxios.get<SimulatorResult>(
      'simulate-create-strategy',
      {
        params: {
          ...params,
          baseBudget: params.sellBudget,
          quoteBudget: params.buyBudget,
        },
      }
    );
    return data;
  },
};

export { carbonApi };
