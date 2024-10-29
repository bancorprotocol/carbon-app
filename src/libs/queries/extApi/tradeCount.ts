import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { carbonApi } from 'utils/carbonApi';

export interface TradeCount {
  strategyId: string;
  tradeCount: number;
}

export const useTradeCount = () => {
  return useQuery({
    queryKey: QueryKey.tradeCount(),
    queryFn: carbonApi.getTradeCount,
    staleTime: ONE_HOUR_IN_MS,
  });
};
