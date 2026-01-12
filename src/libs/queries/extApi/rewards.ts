import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../queryKey';
import { carbonApi } from 'services/carbonApi';
import config from 'config';
import { toSortedPairSlug } from 'utils/pairs';

export interface Reward {
  pair: string;
  tvl?: number;
  apr?: number;
  opportunityName?: string;
}

/** Get the pairs with the string `${base}_${quote}` */
export const useRewards = () => {
  return useQuery({
    queryKey: QueryKey.rewards(),
    queryFn: async () => {
      if (config.ui.rewards?.list) {
        const list = config.ui.rewards.list;
        const allPairs = await carbonApi.getTrending();
        const filtered = allPairs.pairCount.filter((trade) => {
          if (list.includes(trade.token0)) return true;
          if (list.includes(trade.token1)) return true;
          return false;
        });
        return filtered.map(({ token0, token1 }) =>
          toSortedPairSlug(token0, token1),
        );
      } else {
        const all = await carbonApi.getAllRewards();
        return all.map(({ pair }) => pair);
      }
    },
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
