import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries';
import { ONE_DAY_IN_MS } from 'utils/time';
import { useCarbonInit } from 'libs/sdk/context';
import { carbonSDK } from 'libs/sdk';
import config from 'config';

export const useGetTradeLiquidity = (base?: string, quote?: string) => {
  const { isInitialized } = useCarbonInit();
  return useQuery({
    queryKey: QueryKey.tradeSDKLiquidity([base!, quote!]),
    queryFn: () => carbonSDK.getLiquidityByPair(base!, quote!),
    enabled: !!base && !!quote && isInitialized && !config.ui.useDexAggregator,
    staleTime: ONE_DAY_IN_MS,
    refetchOnWindowFocus: false,
  });
};
