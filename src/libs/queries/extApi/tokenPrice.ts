import { useQuery } from '@tanstack/react-query';
import { CandlestickData } from 'libs/d3';
import { QueryKey } from 'libs/queries/queryKey';
import { FIVE_MIN_IN_MS } from 'utils/time';
import { carbonApi } from 'utils/carbonApi';
import { toUnixUTC } from 'components/simulator/utils';
import { startOfDay, subDays } from 'date-fns';

export const useGetTokenPrice = (address?: string) => {
  const pricesQuery = useGetTokensPrice();
  return useQuery({
    queryKey: QueryKey.tokenPrice(address),
    queryFn: async () => {
      if (!address) return;
      const prices = pricesQuery.data ?? {};
      if (prices[address]) return prices[address];
      try {
        return carbonApi.getMarketRate(address);
      } catch (err) {
        console.error(err);
        return 0;
      }
    },
    enabled: !pricesQuery.isPending && !!address,
    refetchInterval: FIVE_MIN_IN_MS,
    refetchOnWindowFocus: false,
    retry: 0, // Critical for initial load
  });
};

export const useGetTokensPrice = () => {
  return useQuery({
    queryKey: QueryKey.tokensPrice(),
    queryFn: () => carbonApi.getTokensMarketPrice(),
    refetchInterval: FIVE_MIN_IN_MS,
    refetchOnWindowFocus: false,
    retry: 0, // Critical for initial load
  });
};

export type TokenPriceHistoryResult = {
  timestamp: number;
  open: string;
  close: string;
  high: string;
  low: string;
};

export interface TokenPriceHistorySearch {
  baseToken?: string;
  quoteToken?: string;
  start?: string;
  end?: string;
}

export const useGetTokenPriceHistory = (params: TokenPriceHistorySearch) => {
  return useQuery<CandlestickData[]>({
    queryKey: QueryKey.tokenPriceHistory(params),
    queryFn: async () => {
      try {
        const data = await carbonApi.getMarketRateHistory(params);
        if (!data || data.length < 2) {
          throw new Error(
            'Not enough data returned from backend, defaulting to placeholder data',
          );
        }
        return data.map((item) => ({
          date: item.timestamp,
          open: Number(item.open),
          close: Number(item.close),
          high: Number(item.high),
          low: Number(item.low),
        }));
      } catch {
        const now = startOfDay(new Date());
        return new Array(365).fill(null).map((_, i) => ({
          date: +toUnixUTC(subDays(now, 365 - i)),
          open: NaN,
          close: NaN,
          high: NaN,
          low: NaN,
        }));
      }
    },
    enabled: !!params.baseToken && !!params.quoteToken,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
