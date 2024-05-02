import { useQueries, useQuery } from '@tanstack/react-query';
import { CandlestickData } from 'libs/d3';
import { QueryKey } from 'libs/queries/queryKey';
import { FIVE_MIN_IN_MS } from 'utils/time';
import { useStore } from 'store';
import { carbonApi } from 'utils/carbonApi';

export const useCompareTokenPrice = (
  baseAddress?: string,
  quoteAddress?: string
) => {
  const basePrice = useGetTokenPrice(baseAddress).data?.USD;
  const quotePrice = useGetTokenPrice(quoteAddress).data?.USD;
  if (typeof basePrice !== 'number' || typeof quotePrice !== 'number') return;
  return basePrice / quotePrice;
};

export const useGetTokenPrice = (address?: string) => {
  const {
    fiatCurrency: { availableCurrencies },
  } = useStore();

  return useQuery(
    QueryKey.tokenPrice(address!),
    async () => carbonApi.getMarketRate(address!, availableCurrencies),
    {
      enabled: !!address && availableCurrencies.length > 0,
      refetchInterval: FIVE_MIN_IN_MS,
      staleTime: FIVE_MIN_IN_MS,
      retry: false,
    }
  );
};

export const useGetMultipleTokenPrices = (addresses: string[] = []) => {
  const {
    fiatCurrency: { availableCurrencies },
  } = useStore();

  return useQueries({
    queries: addresses.map((address) => {
      return {
        queryKey: QueryKey.tokenPrice(address),
        queryFn: () => carbonApi.getMarketRate(address, availableCurrencies),
        enabled: !!address && availableCurrencies.length > 0,
        refetchInterval: FIVE_MIN_IN_MS,
        staleTime: FIVE_MIN_IN_MS,
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
  return useQuery<CandlestickData[]>(
    QueryKey.tokenPriceHistory(params),
    async () => {
      const data = await carbonApi.getMarketRateHistory(params);

      return data.map((item) => ({
        date: item.timestamp,
        open: Number(item.open),
        close: Number(item.close),
        high: Number(item.high),
        low: Number(item.low),
      }));
    },
    {
      enabled: !!params.baseToken && !!params.quoteToken,
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
};
