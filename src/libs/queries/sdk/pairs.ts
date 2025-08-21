import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { useTokens } from 'hooks/useTokens';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { carbonSDK } from 'libs/sdk';
import { lsService } from 'services/localeStorage';
import { useState } from 'react';
import { Token } from 'libs/tokens';
import { useCarbonInit } from 'hooks/useCarbonInit';

export const useGetTradePairsData = () => {
  const { isInitialized } = useCarbonInit();
  const { tokens, getAllTokens } = useTokens();
  const [cache] = useState(lsService.getItem('tokenPairsCache'));

  return useQuery({
    queryKey: QueryKey.pairs(),
    queryFn: async () => {
      const pairs = await carbonSDK.getAllPairs();

      const addresses = new Set(pairs.flat());
      const allTokenMap = await getAllTokens(addresses);

      const result: { baseToken: Token; quoteToken: Token }[] = [];
      for (const pair of pairs) {
        const baseToken = allTokenMap.get(pair[0]);
        const quoteToken = allTokenMap.get(pair[1]);
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
