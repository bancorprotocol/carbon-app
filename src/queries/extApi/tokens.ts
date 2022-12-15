import { useQuery } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists } from 'tokens';
import { QueryKey } from '../queryKey';

export const useTokenLists = () =>
  useQuery(QueryKey.tokenLists(), fetchTokenLists, {
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useTokensQuery = () => {
  const tokenListQuery = useTokenLists();
  return useQuery(
    QueryKey.tokens(),
    () => buildTokenList(tokenListQuery.data!),
    {
      staleTime: 24 * 60 * 60 * 1000,
      enabled: !!tokenListQuery.data?.length,
    }
  );
};
