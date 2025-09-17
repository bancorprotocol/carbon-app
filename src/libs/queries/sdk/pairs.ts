import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { carbonSDK } from 'libs/sdk';

export const useGetAllPairs = () => {
  return useQuery({
    queryKey: QueryKey.pairs(),
    queryFn: () => carbonSDK.getAllPairs(),
  });
};
