import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { obj } from 'index';

export const useGetTradeLiquidity = (token0?: string, token1?: string) => {
  const { isInitialized } = useCarbonSDK();

  return useQuery({
    queryKey: QueryKey.tradeLiquidity(token0!, token1!),
    queryFn: async () => obj.getLiquidityByPair(token0!, token1!),
    enabled: !!token0 && !!token1 && isInitialized,
    staleTime: ONE_DAY_IN_MS,
  });
};
