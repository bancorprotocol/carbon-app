import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../queryKey';
import { carbonApi } from 'utils/carbonApi';

export interface Reward {
  pair: string;
  tvl: number;
  apr: number;
  opportunityName: string;
}

/** Get the pairs with the string `${base}_${quote}` */
export const useRewards = () => {
  return useQuery({
    queryKey: QueryKey.rewards(),
    queryFn: () => carbonApi.getAllRewards(),
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
