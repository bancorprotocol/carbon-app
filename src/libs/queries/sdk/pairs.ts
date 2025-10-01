import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { carbonSDK } from 'libs/sdk';
import { ONE_HOUR_IN_MS } from 'utils/time';

export const useGetAllPairs = () => {
  return useQuery({
    queryKey: QueryKey.pairs(),
    queryFn: () => carbonSDK.getAllPairs(),
    staleTime: ONE_HOUR_IN_MS,
    refetchOnWindowFocus: false,
  });
};
