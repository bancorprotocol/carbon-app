import { useQuery } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';

export const useTokensQuery = () => {
  return useQuery(
    QueryKey.tokens(),
    async () => buildTokenList(await fetchTokenLists()),
    {
      staleTime: ONE_DAY_IN_MS,
    }
  );
};
