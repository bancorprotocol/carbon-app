import { useQueries } from '@tanstack/react-query';
import { QueryKey } from '../queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { carbonApi } from 'utils/carbonApi';
import config from 'config';

export interface Reward {
  pair: string;
  tvl: number;
  apr: number;
  opportunityName: string;
}

/** Get the pairs with the string `${base}_${quote}` */
export const useRewards = (pairs: string[]) => {
  return useQueries({
    combine: (rewards) => {
      if (rewards.some((r) => r.isPending))
        return { isPending: true, data: undefined };
      const data: Record<string, Reward> = {};
      for (const reward of rewards) {
        if (!reward.data) continue;
        data[reward.data.pair] = reward.data;
      }
      return { isPending: false, data };
    },
    queries: pairs.map((pair) => ({
      queryKey: QueryKey.reward(pair),
      queryFn: () => {
        try {
          if (!config.ui.rewardUrl) return null;
          return carbonApi.getReward(pair);
        } catch {
          return null;
        }
      },
      staleTime: ONE_HOUR_IN_MS,
      refetchInterval: 120_000,
      retry: false,
      refetchOnWindowFocus: false,
    })),
  });
};
