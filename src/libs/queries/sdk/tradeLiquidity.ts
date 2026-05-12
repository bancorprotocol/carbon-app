import { useQuery } from '@tanstack/react-query';
import { QueryKey, useGetAllStrategies } from 'libs/queries';
import { ONE_DAY_IN_MS } from 'utils/time';
import { carbonSDK } from 'libs/sdk';
import config from 'config';
import { Token } from 'libs/tokens';

export const useGetTradeLiquidity = (source: Token, target: Token) => {
  const { data: strategies } = useGetAllStrategies({
    enabled: !config.ui.useDexAggregator,
  });
  return useQuery({
    queryKey: QueryKey.tradeSDKLiquidity([source.address, target.address]),
    queryFn: () => {
      return carbonSDK.getLiquidityByPair({
        sourceToken: source.address,
        targetToken: target.address,
        targetDecimals: target.decimals,
        strategies: strategies!.map((s) => s.encoded).filter((e) => !!e),
      });
    },
    enabled: !!strategies && !config.ui.useDexAggregator,
    staleTime: ONE_DAY_IN_MS,
    refetchOnWindowFocus: false,
  });
};
