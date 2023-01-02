import { useQuery } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';

export const useTokenLists = () =>
  useQuery(QueryKey.tokenLists(), fetchTokenLists, {
    staleTime: ONE_DAY_IN_MS,
  });

export const useTokensQuery = () => {
  const tokenListQuery = useTokenLists();
  return useQuery(
    QueryKey.tokens(),
    () => buildTokenList(tokenListQuery.data!),
    {
      staleTime: ONE_DAY_IN_MS,
      enabled: !!tokenListQuery.data?.length,
    }
  );
};
