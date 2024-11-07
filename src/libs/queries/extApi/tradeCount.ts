import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { carbonApi } from 'utils/carbonApi';

interface TradeCount {
  id: string;
  strategyTrades: number;
  strategyTrades_24h: number;
  token0: string;
  token1: string;
  symbol0: string;
  symbol1: string;
  pairSymbol: string;
  pairAddresses: string;
}

export interface Trending {
  totalTradeCount: number;
  tradeCount: TradeCount[];
}

export const useTrending = () => {
  return useQuery({
    queryKey: QueryKey.tradeCount(),
    queryFn: carbonApi.getTrending,
    staleTime: ONE_HOUR_IN_MS,
    refetchInterval: 30_000,
  });
};

export const useTradeCount = () => {
  const query = useTrending();
  const tradeCount: Record<string, number> = {};
  for (const item of query.data?.tradeCount ?? []) {
    tradeCount[item.id] = item.strategyTrades;
  }
  return tradeCount;
};
