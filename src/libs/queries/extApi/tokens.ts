import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { buildTokenList, fetchTokenLists, Token, TokenList } from 'libs/tokens';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { lsService } from 'services/localeStorage';
import { useGetAllPairs } from '../sdk/pairs';
import { useContract } from 'hooks/useContract';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useMemo } from 'react';
import { carbonApi } from 'utils/carbonApi';
import config from 'config';

export const useExistingTokensQuery = () => {
  const persitent = useMemo(() => lsService.getItem('tokenListCache'), []);

  return useQuery({
    queryKey: QueryKey.tokens(),
    queryFn: async () => {
      const [apiTokens, localList] = await Promise.all([
        carbonApi.getTokens(),
        fetchTokenLists(),
      ]);
      const apiList: TokenList = {
        id: 'api',
        name: 'api',
        tokens: apiTokens,
      };
      const tokens = buildTokenList(localList.concat(apiList));

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

  return useQuery({
    queryKey: QueryKey.missingTokens(),
    queryFn: async () => {
      const previous: Token[] = [];
      const imported = lsService.getItem('importedTokens') || [];
      const existing = new Set();

      // Tokens from app files
      for (const token of existingTokens.data || []) {
        existing.add(token.address.toLowerCase());
      }

      // Manually imported tokens from local storage
      for (const token of imported || []) {
        // If we add a new token in local list which is already in imported LS, ignore it
        if (!existing.has(token.address.toLowerCase())) {
          existing.add(token.address.toLowerCase());
          previous.push(token);
        }
      }

      const missing = new Set<string>();
      const fillMissing = (address: string) => {
        if (!existing.has(address.toLowerCase())) missing.add(address);
      };

      // SDK: all tokens from current strategies (require for Tenderly)
      for (const [base, quote] of pairs.data || []) {
        fillMissing(base);
        fillMissing(quote);
      }

      // Config: Mainly for testnet on new chains
      for (const base of config.popularTokens) {
        fillMissing(base);
      }

      const missingTokens = await getMissingTokens(missing, (address) =>
        fetchTokenData(Token, address),
      );

      const tokens = previous.concat(missingTokens);
      lsService.setItem('importedTokens', tokens);
      return tokens;
    },
    initialData: () => lsService.getItem('importedTokens'),
    enabled: !!existingTokens.data && !pairs.isPending,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const getMissingTokens = async (
  addresses: Set<string>,
  getToken: (address: string) => Promise<Token>,
) => {
  const getTokens: Promise<Token>[] = [];
  for (const address of addresses) {
    getTokens.push(getToken(address));
  }
  const tokens: Token[] = [];
  const step = 100;
  for (let i = 0; i < getTokens.length; i += step) {
    const max = Math.min(i + step, getTokens.length);
    const batch = getTokens.slice(i, max);
    const responses = await Promise.allSettled(batch);
    for (const res of responses) {
      if (res.status === 'fulfilled') {
        tokens.push(res.value);
      } else {
        console.error(res.reason);
      }
    }
  }
  return tokens;
};
