import { useCarbonInit } from 'hooks/useCarbonInit';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';
import { carbonSDK } from 'libs/sdk';

export type OrderRow = {
  rate: string;
  total: string;
  amount: string;
  originalTotal?: string;
};

export type OrderBook = {
  buy: OrderRow[];
  sell: OrderRow[];
  middleRate: string;
  step?: string;
};

export const useGetOrderBook = (
  steps: number,
  base?: string,
  quote?: string,
) => {
  const { isInitialized } = useCarbonInit();

  return useQuery({
    queryKey: QueryKey.tradeOrderBook([base!, quote!], steps),
    queryFn: () => carbonSDK.getOrderBook(base!, quote!, steps),
    enabled: isInitialized && !!base && !!quote,
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};

export const useGetOrderBookLastTradeBuy = (base?: string, quote?: string) => {
  const { isInitialized } = useCarbonInit();

  return useQuery({
    queryKey: QueryKey.tradeOrderBookLastTradeBuy([base!, quote!]),
    queryFn: async () => {
      const res = await carbonSDK.getLastTradeByPair(base!, quote!);
      const source = res?.sourceToken;
      const target = res?.targetToken;

      return source === base && target === quote;
    },
    enabled: isInitialized && !!base && !!quote,
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};
