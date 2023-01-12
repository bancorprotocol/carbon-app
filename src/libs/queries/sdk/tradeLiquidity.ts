import { useQuery } from '@tanstack/react-query';
import { sdk, useCarbonSDK } from 'libs/sdk';

export const useGetTradeLiquidity = (token0?: string, token1?: string) => {
  const { isInitialized } = useCarbonSDK();

  return useQuery({
    queryKey: ['sdk', 'liquidity', token0, token1],
    queryFn: async () => sdk.getLiquidityByPair(token0!, token1!),
    enabled: !!token0 && !!token1 && isInitialized,
    cacheTime: 0,
  });
};
