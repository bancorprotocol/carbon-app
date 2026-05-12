import { useQuery } from '@tanstack/react-query';
import { QueryKey, useGetAllStrategies } from 'libs/queries';
import { ONE_DAY_IN_MS } from 'utils/time';
import { carbonSDK } from 'libs/sdk';
import config from 'config';
import { Token } from 'libs/tokens';

export const useGetMaxSource = (source: Token, target: Token) => {
  const { data: strategies } = useGetAllStrategies({
    enabled: !config.ui.useDexAggregator,
  });

  return useQuery({
    queryKey: QueryKey.tradeMaxSourceAmount([source.address, target.address]),
    queryFn: () => {
      return carbonSDK.getMaxSourceAmountByPair({
        sourceToken: source.address,
        sourceDecimals: source.decimals,
        targetToken: target.address,
        strategies: strategies!.map((s) => s.encoded).filter((e) => !!e),
      });
    },
    enabled: !!strategies && !config.ui.useDexAggregator,
    staleTime: ONE_DAY_IN_MS,
  });
};
