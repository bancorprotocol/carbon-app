import axios from 'axios';
import {
  SimulatorAPIParams,
  SimulatorResult,
} from 'libs/queries/extApi/simulator';
import {
  TokenPriceHistoryResult,
  TokenPriceHistorySearch,
} from 'libs/queries/extApi/tokenPrice';
import config from 'config';
import { ServerActivity } from 'libs/queries/extApi/activity';

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
  getActivity: async (): Promise<ServerActivity[]> => {
    return fetch('/mocks/activity.json').then((response) => response.json());
    // const { data } = await newApiAxios.get<ServerActivity[]>('activity');
    // return data;
  },
};

export { carbonApi };
