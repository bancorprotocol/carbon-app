import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { obj } from 'index';

export const useGetTradePairsData = () => {
  const { isInitialized } = useCarbonSDK();
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
      console.log('useGetTradePairsData');
      const pairs = await obj.getPairs();
      console.log('pairs jan jan', pairs);
      const pairsWithLiquidity = pairs.filter((pair) => {
        const buy = obj.hasLiquidityByPair(pair[0], pair[1]);
        const sell = obj.hasLiquidityByPair(pair[1], pair[0]);
        return buy || sell;
      });
      const promises = pairsWithLiquidity.map(async (pair) => ({
        baseToken: getTokenById(pair[0]) ?? (await _getTknData(pair[0])),
        quoteToken: getTokenById(pair[1]) ?? (await _getTknData(pair[1])),
      }));
      const result = await Promise.all(promises);

      return [
        ...result,
        ...result.map((p) => ({
          baseToken: p.quoteToken,
          quoteToken: p.baseToken,
        })),
      ];
    },
    enabled: !!tokens.length && isInitialized,
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};
