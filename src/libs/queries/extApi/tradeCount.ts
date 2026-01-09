import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { carbonApi } from 'services/carbonApi';

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
    refetchInterval: Infinity,
    refetchOnWindowFocus: false,
  });
};
