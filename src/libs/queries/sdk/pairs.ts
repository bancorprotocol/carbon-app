import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { carbonSDK } from 'libs/sdk';
import { lsService } from 'services/localeStorage';

const getCachedData = () => {
  const cachedPairs = lsService.getItem('tokenPairsCache');
  if (cachedPairs && cachedPairs.timestamp > Date.now() - 1000 * 60 * 60) {
    return cachedPairs.pairs;
  }
  return undefined;
};

export const useGetTradePairsData = () => {
  const { isInitialized } = useCarbonInit();
  const { Token } = useContract();
  const { tokens, getTokenById, importToken } = useTokens();

  const _getTknData = async (address: string) => {
    const data = await fetchTokenData(Token, address);
    importToken(data);
    return data;
  };

  return useQuery({
    queryKey: QueryKey.pairs(),
    queryFn: async () => {
      const pairs = await carbonSDK.getAllPairs();
      const promises = pairs.map(async (pair) => ({
        baseToken: getTokenById(pair[0]) ?? (await _getTknData(pair[0])),
        quoteToken: getTokenById(pair[1]) ?? (await _getTknData(pair[1])),
      }));
      const result = await Promise.all(promises);

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
    initialData: getCachedData(),
    enabled: !!tokens.length && isInitialized,
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};
