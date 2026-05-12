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
  ServerActivityMeta,
} from 'libs/queries/extApi/activity';
import { lsService } from 'services/localeStorage';
import { Trending } from 'libs/queries/extApi/tradeCount';
import { Reward } from 'libs/queries/extApi/rewards';
import { Token } from 'libs/tokens';
import {
  StrategiesSearchParams,
  StrategyAPIResult,
} from 'libs/queries/extApi/strategy';

interface MarketRate {
  data: { USD: number };
}

const getResponse = async (
  endpoint: string,
  params: object = {},
  abortSignal?: AbortSignal,
) => {
  const api = lsService.getItem('carbonApi') || config.carbonApi;
  const url = new URL(api + endpoint);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  }
  const response = await fetch(url, { signal: abortSignal });
  if (!response.ok) {
    const result = await response.json();
    const error = (result as { error?: string }).error;
    throw new Error(
      error ||
        `Response was not okay. ${response.statusText} response received.`,
    );
  }
  return response;
};

const getJSON = async <T>(
  endpoint: string,
  params: object = {},
  abortSignal?: AbortSignal,
): Promise<T> => {
  const res = await getResponse(endpoint, params, abortSignal);
  return res.json();
};

const carbonApi = {
  getCheck: async (): Promise<boolean> => {
    if (config.mode === 'development') return false;
    const res = await fetch(`/api/check`, { cache: 'no-store' });
    return res.json();
  },
  getTokens: () => {
    return getJSON<Token[]>('tokens');
  },
  getTokensMarketPrice: () => {
    return getJSON<Record<string, number>>('tokens/prices');
  },
  getMarketRateHistory: async (
    params: TokenPriceHistorySearch,
  ): Promise<TokenPriceHistoryResult[]> => {
    return getJSON<TokenPriceHistoryResult[]>('history/prices', params);
  },
  getMarketRate: async (address: string) => {
    const params = { address, convert: ['USD'] };
    const result = await getJSON<MarketRate>('market-rate', params);
    return result.data.USD;
  },
  getSimulator: async (
    params: SimulatorAPIParams,
  ): Promise<SimulatorReturnNew> => {
    return getJSON<SimulatorReturnNew>('simulator/create', params);
  },
  getStrategies: (params?: StrategiesSearchParams) => {
    return getJSON<StrategyAPIResult>('strategies', params);
  },
  getActivity: async (
    params: QueryActivityParams,
    abortSignal?: AbortSignal,
  ) => {
    return getJSON<ServerActivity[]>('activity', params, abortSignal);
  },
  getActivityMeta: async (params: QueryActivityParams) => {
    return getJSON<ServerActivityMeta>('activity/meta', params);
  },
  getTrending: () => getJSON<Trending>('analytics/trending'),
  getReward: (pair: string) => getJSON<Reward>('merkle/data', { pair }),
  getAllRewards: () => getJSON<Reward[]>('merkle/all-data'),
  getSeedData: () => getResponse('seed-data').then((res) => res.text()),
};

export { carbonApi };
