import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { carbonApi } from 'utils/carbonApi';

export interface StrategyTrade {
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
export interface PairTrade {
  pairId: string;
  pairTrades: number;
  pairTrades_24h: number;
  token0: string;
  token1: string;
  symbol0: string;
  symbol1: string;
  pairSymbol: string;
  pairAddresses: string;
}

export interface Trending {
  totalTradeCount: number;
  tradeCount: StrategyTrade[];
  pairCount: PairTrade[];
}

export const useTrending = () => {
  return useQuery({
    queryKey: QueryKey.trending(),
    queryFn: carbonApi.getTrending,
    staleTime: ONE_HOUR_IN_MS,
    refetchInterval: 120_000,
  });
};

interface StrategyTradeCount {
  tradeCount: number;
  tradeCount24h: number;
}

export const useTradeCount = () => {
  const query = useTrending();
  const tradeCount: Record<string, StrategyTradeCount> = {};
  for (const item of query.data?.tradeCount ?? []) {
    tradeCount[item.id] = {
      tradeCount: item.strategyTrades,
      tradeCount24h: item.strategyTrades_24h,
    };
  }
  return { data: tradeCount, isPending: query.isPending };
};
