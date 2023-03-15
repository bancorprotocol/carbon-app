import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';
import { carbonSDK } from 'index';
import { orderBookConfig } from 'workers/sdk';

export type OrderRow = { rate: string; total: string; amount: string };

export type OrderBook = {
  buy: OrderRow[];
  sell: OrderRow[];
  middleRate: string;
  step?: string;
};

export const useGetOrderBook = (
  base?: string,
  quote?: string,
  buckets = orderBookConfig.buckets.depthChart
) => {
  const { isInitialized } = useCarbonSDK();

  return useQuery({
    queryKey: QueryKey.tradeOrderBook(base!, quote!, buckets),
    queryFn: () => carbonSDK.getOrderBook(base!, quote!, buckets),
    enabled: isInitialized && !!base && !!quote,
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};
