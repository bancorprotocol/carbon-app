import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists, Token } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { lsService } from 'services/localeStorage';
import { useGetAllPairs } from '../sdk/pairs';
import { useContract } from 'hooks/useContract';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useWagmi } from 'libs/wagmi';
import { useMemo } from 'react';
import config from 'config';

export const useExistingTokensQuery = () => {
  const persitent = useMemo(() => lsService.getItem('tokenListCache'), []);

  return useQuery({
    queryKey: QueryKey.tokens(),
    queryFn: async () => {
      const tokens = buildTokenList(await fetchTokenLists());
      lsService.setItem('tokenListCache', { tokens, timestamp: Date.now() });
      return tokens;
    },
    staleTime: ONE_HOUR_IN_MS,
    initialData: persitent?.tokens,
    initialDataUpdatedAt: persitent?.timestamp,
    refetchOnWindowFocus: false,
    meta: {
      errorMessage: 'useTokensQuery failed with error:',
    },
  });
};

export const useMissingTokensQuery = (
  existingTokens: UseQueryResult<Token[], Error>,
) => {
  const pairs = useGetAllPairs();
  const { Token } = useContract();
  // We need provider before fetching tokens
  const { provider } = useWagmi();

  return useQuery({
    queryKey: QueryKey.missingTokens(),
    queryFn: async () => {
      const existing = new Set(
        existingTokens.data!.map((t) => t.address.toLowerCase()),
      );
      const missing = new Set<string>();
      const fillMissing = (address: string) => {
        if (!existing.has(address.toLowerCase())) missing.add(address);
      };
      for (const [base, quote] of pairs.data!) {
        fillMissing(base);
        fillMissing(quote);
      }
      for (const base of config.popularTokens.base) {
        fillMissing(base);
      }
      for (const quote of config.popularTokens.quote) {
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
    refetchOnWindowFocus: false,
  });
};
