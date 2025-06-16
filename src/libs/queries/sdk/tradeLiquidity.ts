import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useCarbonInit } from 'hooks/useCarbonInit';
import { carbonSDK } from 'libs/sdk';

export const useGetTradeLiquidity = (base?: string, quote?: string) => {
  const { isInitialized } = useCarbonInit();

  return useQuery({
    queryKey: QueryKey.tradeLiquidity([base!, quote!]),
    queryFn: () => {
      try {
        return carbonSDK.getLiquidityByPair(base!, quote!);
      } catch (err) {
        console.error('Cannot find liquidity', err);
        return '0';
      }
    },
    enabled: !!base && !!quote && isInitialized,
    staleTime: ONE_DAY_IN_MS,
  });
};
