import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../queryKey';
import { carbonApi } from 'services/carbonApi';
import { toSortedPairSlug } from 'utils/pairs';
import config, { CarbonNetworks, getAllConfigs } from 'config';
import { AppConfig } from 'config/types';

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

export const useAllChainRewards = () => {
  return useQuery({
    queryKey: QueryKey.allChainsRewards(),
    queryFn: async () => {
      const allConfigs = getAllConfigs();
      const getRewards = async (network: CarbonNetworks, config: AppConfig) => {
        if (!config.ui.rewards) return;
        const url = config.carbonApi + 'merkle/all-data';
        const res = await fetch(url);
        const result = await res.json();
        if (!res.ok) {
          const error = (result as { error?: string }).error;
          throw new Error(error);
        } else {
          return [network, result] as [CarbonNetworks, Reward[]];
        }
      };
      const getAll = Object.entries(allConfigs).map(([network, config]) => {
        return getRewards(network as CarbonNetworks, config);
      });
      const responses = await Promise.allSettled(getAll);
      const rewards: [CarbonNetworks, Reward[]][] = [];
      for (const res of responses) {
        if (res.status === 'rejected') {
          console.error(res.reason);
        } else if (res.value) {
          rewards.push(res.value);
        }
      }
      return rewards;
    },
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
