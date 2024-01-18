import { useQuery } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';
import { lsService } from 'services/localeStorage';

export const useTokensQuery = () => {
  return useQuery(
    QueryKey.tokens(),
    async () => {
      const tokens = buildTokenList(await fetchTokenLists());
      lsService.setItem('tokenListCache', { tokens, timestamp: Date.now() });
      return tokens;
    },
    {
      placeholderData: lsService.getItem('tokenListCache')?.tokens,
      staleTime: ONE_DAY_IN_MS,
    }
  );
};
