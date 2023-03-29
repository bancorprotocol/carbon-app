import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { carbonSDK } from 'libs/sdk';

export const useGetTradeLiquidity = (base?: string, quote?: string) => {
  const { isInitialized } = useCarbonSDK();

  return useQuery({
    queryKey: QueryKey.tradeLiquidity([base!, quote!]),
    queryFn: async () => carbonSDK.getLiquidityByPair(base!, quote!),
    enabled: !!base && !!quote && isInitialized,
    staleTime: ONE_DAY_IN_MS,
  });
};
