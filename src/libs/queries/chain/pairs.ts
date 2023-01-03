import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useContract } from 'hooks/useContract';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useTokens } from 'libs/tokens';

export const useGetTradePairsData = () => {
  const { PoolCollection, Token } = useContract();
  const { tokens, getTokenById } = useTokens();

  return useQuery({
    queryKey: QueryKey.pairs(),
    queryFn: async () => {
      const pairs = await PoolCollection.read.pairs();
      const promises = pairs.map(async (pair) => ({
        baseToken:
          getTokenById(pair[0]) ?? (await fetchTokenData(Token, pair[0])),
        quoteToken:
          getTokenById(pair[1]) ?? (await fetchTokenData(Token, pair[1])),
      }));
      return await Promise.all(promises);
    },
    enabled: !!tokens.length,
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};
