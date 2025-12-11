import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { carbonSDK } from 'libs/sdk';
import { useCarbonInit } from 'libs/sdk/context';
import { ONE_HOUR_IN_MS } from 'utils/time';

export const useGetAllPairs = () => {
  const { isEnabled } = useCarbonInit();
  return useQuery({
    queryKey: QueryKey.pairs(),
    queryFn: () => carbonSDK.getAllPairs(),
    enabled: isEnabled,
    staleTime: ONE_HOUR_IN_MS,
    refetchOnWindowFocus: false,
  });
};
