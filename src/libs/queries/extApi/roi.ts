import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { FIVE_MIN_IN_MS } from 'utils/time';
import { carbonApi } from 'utils/carbonApi';
import config from 'config';

export const useGetRoi = () => {
  return useQuery({
    queryKey: QueryKey.roi(),
    queryFn: async () => !!config.showStrategyRoi && carbonApi.getRoi(),
    refetchInterval: FIVE_MIN_IN_MS,
    staleTime: FIVE_MIN_IN_MS,
  });
};
