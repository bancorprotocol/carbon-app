import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { carbonSDK } from 'libs/sdk';
import { lsService } from 'services/localeStorage';
import { useState } from 'react';
import { Token } from 'libs/tokens';
import { useCarbonInit } from 'hooks/useCarbonInit';

export const useGetTradePairsData = () => {
  const { isInitialized } = useCarbonInit();
  const { Token } = useContract();
  const { tokens, getTokenById, importTokens } = useTokens();
  const [cache] = useState(lsService.getItem('tokenPairsCache'));

  return useQuery({
    queryKey: QueryKey.pairs(),
    queryFn: async () => {
      const pairs = await carbonSDK.getAllPairs();
      const tokens = new Map<string, Token>();
      const missing = new Set<string>();

      const markForMissing = (address: string) => {
        if (tokens.has(address)) return;
        const existing = getTokenById(address);
        if (existing) tokens.set(address, existing);
        else missing.add(address);
      };

      for (const pair of pairs) {
        markForMissing(pair[0]);
        markForMissing(pair[1]);
      }

      const missingTokens: Token[] = [];
      const getMissing = Array.from(missing).map(async (address) => {
        const token = await fetchTokenData(Token, address);
        missingTokens.push(token);
        tokens.set(address, token);
        return token;
      });
      const responses = await Promise.allSettled(getMissing);
      for (const response of responses) {
        if (response.status === 'rejected') console.error(response.reason);
      }
      importTokens(missingTokens);

      const result: { baseToken: Token; quoteToken: Token }[] = [];
      for (const pair of pairs) {
        const baseToken = tokens.get(pair[0]);
        const quoteToken = tokens.get(pair[1]);
        if (baseToken && quoteToken) result.push({ baseToken, quoteToken });
      }

      const pairsWithInverse = [
        ...result,
        ...result.map((p) => ({
          baseToken: p.quoteToken,
          quoteToken: p.baseToken,
        })),
      ];

      lsService.setItem('tokenPairsCache', {
        pairs: pairsWithInverse,
        timestamp: Date.now(),
      });

      return pairsWithInverse;
    },
    initialData: cache?.pairs,
    initialDataUpdatedAt: cache?.timestamp,
    enabled: !!tokens.length && !!isInitialized,
    retry: 1,
    staleTime: ONE_HOUR_IN_MS,
  });
};
