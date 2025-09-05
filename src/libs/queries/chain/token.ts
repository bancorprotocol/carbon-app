import { useQuery } from '@tanstack/react-query';
import { useContract } from 'hooks/useContract';
import { QueryKey } from 'libs/queries/queryKey';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { ONE_DAY_IN_MS } from 'utils/time';

export const useGetTokenData = (address: string) => {
  const { Token } = useContract();

  return useQuery({
    queryKey: QueryKey.token(address),
    queryFn: () => fetchTokenData(Token, address),
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};
