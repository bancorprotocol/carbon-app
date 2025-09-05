import { useQuery } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists, Token } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { lsService } from 'services/localeStorage';
import { useGetAllPairs } from '../sdk/pairs';
import { useContract } from 'hooks/useContract';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useWagmi } from 'libs/wagmi';

export const useExistingTokensQuery = () => {
  return useQuery({
    queryKey: QueryKey.tokens(),
    queryFn: async () => {
      const local = lsService.getItem('tokenListCache');
      if (local && local.timestamp > Date.now() - ONE_HOUR_IN_MS) {
        return local.tokens;
      }
      const tokens = buildTokenList(await fetchTokenLists());
      lsService.setItem('tokenListCache', { tokens, timestamp: Date.now() });
      return tokens;
    },
    staleTime: ONE_HOUR_IN_MS,
    placeholderData: (previous) => previous,
    meta: {
      errorMessage: 'useTokensQuery failed with error:',
    },
  });
};

export const useMissingTokensQuery = () => {
  const existingTokens = useExistingTokensQuery();
  const pairs = useGetAllPairs();
  const { Token } = useContract();
  // We need provider before fetching tokens
  const { provider } = useWagmi();

  return useQuery({
    queryKey: QueryKey.missingTokens(),
    queryFn: async () => {
      const existing = new Set(existingTokens.data!.map((t) => t.address));
      const missing = new Set<string>();
      const fillMissing = (address: string) => {
        if (!existing.has(address)) missing.add(address);
      };
      for (const [base, quote] of pairs.data!) {
        fillMissing(base);
        fillMissing(quote);
      }

      const getTokens: Promise<Token>[] = [];
      for (const address of missing) {
        const getToken = fetchTokenData(Token, address).catch((err) => {
          console.error(`Error fetching Token ${address}`);
          throw err;
        });
        getTokens.push(getToken);
      }

      const tokens: Token[] = [];
      const responses = await Promise.allSettled(getTokens);
      for (const res of responses) {
        if (res.status === 'fulfilled') {
          tokens.push(res.value);
        } else {
          console.error(res.reason);
        }
      }

      lsService.setItem('importedTokens', tokens);
      return tokens;
    },
    initialData: () => lsService.getItem('importedTokens'),
    enabled: !!existingTokens.data && !!pairs.data && !!provider,
  });
};
