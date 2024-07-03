import { useQuery } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { lsService } from 'services/localeStorage';

export const useTokensQuery = () => {
  return useQuery({
    queryKey: QueryKey.tokens(),
    queryFn: async () => {
      const tokens = buildTokenList(await fetchTokenLists());
      lsService.setItem('tokenListCache', { tokens, timestamp: Date.now() });
      return tokens;
    },
    staleTime: ONE_HOUR_IN_MS,
    initialData: lsService.getItem('tokenListCache')?.tokens,
    initialDataUpdatedAt: lsService.getItem('tokenListCache')?.timestamp,
    meta: {
      errorMessage: 'useTokensQuery failed with error:',
    },
  });
};
