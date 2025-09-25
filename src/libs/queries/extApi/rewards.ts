import { useQueries } from '@tanstack/react-query';
import { QueryKey } from '../queryKey';
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
      if (rewards.some((r) => r.isPending)) {
        return { isPending: true, data: undefined };
      }
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
        if (!config.ui.rewardUrl) return null;
        return carbonApi.getReward(pair).catch(() => null);
      },
      staleTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    })),
  });
};
