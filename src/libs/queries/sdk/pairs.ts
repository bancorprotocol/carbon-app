import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useContract } from 'hooks/useContract';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useTokens } from 'libs/tokens';
import { sdk, useCarbonSDK } from 'libs/sdk';

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
      const pairs = sdk.pairs;
      console.log('pairs', pairs);
      const promises = pairs.map(async (pair) => ({
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
