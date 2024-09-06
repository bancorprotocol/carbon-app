import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { FIVE_MIN_IN_MS } from 'utils/time';
import { carbonApi } from 'utils/carbonApi';
import config from 'config';

export const useGetRoi = () => {
  return useQuery({
    queryKey: QueryKey.roi(),
    // Note: config.showStrategyRoi is not used in the 'enabled' option because
    // useGetRoi.isFetched is used as an 'enabled' signal for other queries.
    // If this flag is set to false, the query will finish fetching but not fetch from the API.
    queryFn: async () => !!config.showStrategyRoi && carbonApi.getRoi(),
    refetchInterval: FIVE_MIN_IN_MS,
    staleTime: FIVE_MIN_IN_MS,
  });
};
