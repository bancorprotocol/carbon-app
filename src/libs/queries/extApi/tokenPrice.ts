import { useQueries, useQuery } from '@tanstack/react-query';
import { CandlestickData } from 'libs/d3';
import { QueryKey } from 'libs/queries/queryKey';
import { FIVE_MIN_IN_MS } from 'utils/time';
import { useStore } from 'store';
import { FiatPriceDict, carbonApi } from 'utils/carbonApi';
import { toUnixUTC } from 'components/simulator/utils';
import { startOfDay, subDays } from 'date-fns';

export const useGetTokenPrice = (address?: string) => {
  const {
    fiatCurrency: { availableCurrencies },
  } = useStore();
  return useQuery({
    queryKey: QueryKey.tokenPrice(address?.toLowerCase()),
    queryFn: () => {
      return carbonApi
        .getMarketRate(address!, availableCurrencies)
        .then((res) => {
          if (Object.values(res).some((rate) => rate < 0)) {
            throw new Error('Negative market rate from backend');
          }
          return res;
        })
        .catch((err) => {
          console.error(err);
          // Return an empty object to prevent refetch on error from child component
          // @todo(#1438) see how to multi cast the error state
          return {} as FiatPriceDict;
        });
    },
    enabled: !!address && availableCurrencies.length > 0,
    refetchInterval: FIVE_MIN_IN_MS,
    staleTime: FIVE_MIN_IN_MS,
  });
};

export const useGetMultipleTokenPrices = (addresses: string[] = []) => {
  const {
    fiatCurrency: { availableCurrencies },
  } = useStore();

  return useQueries({
    queries: addresses.map((address) => {
      return {
        queryKey: QueryKey.tokenPrice(address),
        queryFn: () => {
          return carbonApi
            .getMarketRate(address, availableCurrencies)
            .catch((err) => {
              // See comment above
              console.error(err);
              return {} as FiatPriceDict;
            });
        },
        enabled: !!address && availableCurrencies.length > 0,
        refetchInterval: FIVE_MIN_IN_MS,
        staleTime: FIVE_MIN_IN_MS,
        refetchOnWindowFocus: false,
        retry: 0, // Critical for initial load
      };
    }),
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
