import { useQuery } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';
import { lsService } from 'services/localeStorage';
import { mergeArraysRemovingDuplicates } from 'utils/helpers';

const getCachedData = () => {
  const cachedTokens = lsService.getItem('tokenListCache');
  const importedTokens = lsService.getItem('importedTokens') || [];
  if (
    cachedTokens &&
    cachedTokens.timestamp > Date.now() - 1000 * 60 * 60 * 24 * 7
  ) {
    return mergeArraysRemovingDuplicates(
      cachedTokens.tokens,
      importedTokens,
      'address'
    );
  }
  return undefined;
};

export const useTokensQuery = () => {
  return useQuery(
    QueryKey.tokens(),
    async () => {
      const tokens = buildTokenList(await fetchTokenLists());
      lsService.setItem('tokenListCache', { tokens, timestamp: Date.now() });
      return tokens;
    },
    {
      placeholderData: getCachedData(),
      staleTime: ONE_DAY_IN_MS,
    }
  );
};
