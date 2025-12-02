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
import { StrategyAPI } from 'libs/queries/extApi/strategy';

const get = async <T>(
  endpoint: string,
  params: object = {},
  abortSignal?: AbortSignal,
): Promise<T> => {
  const api = lsService.getItem('carbonApi') || config.carbonApi;
  const url = new URL(api + endpoint);
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
  return result as T;
};

const carbonApi = {
  getCheck: async (): Promise<boolean> => {
    if (config.mode === 'development') return false;
    const res = await fetch(`/api/check`, { cache: 'no-store' });
    return res.json();
  },
  getTokens: () => {
    return get<Token[]>('tokens');
  },
  getTokensMarketPrice: () => {
    return get<Record<string, number>>('tokens/prices');
  },
  getMarketRateHistory: async (
    params: TokenPriceHistorySearch,
  ): Promise<TokenPriceHistoryResult[]> => {
    return get<TokenPriceHistoryResult[]>('history/prices', params);
  },
  getSimulator: async (
    params: SimulatorAPIParams,
  ): Promise<SimulatorReturnNew> => {
    return get<SimulatorReturnNew>('simulator/create', params);
  },
  getAllStrategies: () => {
    return get<StrategyAPI[]>('strategies');
  },
  getActivity: async (
    params: QueryActivityParams,
    abortSignal?: AbortSignal,
  ) => {
    return get<ServerActivity[]>('activity', params, abortSignal);
  },
  getActivityMeta: async (params: QueryActivityParams) => {
    return get<ServerActivityMeta>('activity/meta', params);
  },
  getTrending: () => get<Trending>('analytics/trending'),
  getReward: (pair: string) => get<Reward>('merkle/data', { pair }),
  getAllRewards: () => get<Reward[]>('merkle/all-data'),
};

export { carbonApi };
