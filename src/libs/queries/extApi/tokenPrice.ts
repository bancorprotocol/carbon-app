import { useQuery } from '@tanstack/react-query';
import { CandlestickData } from 'libs/d3';
import { QueryKey } from 'libs/queries/queryKey';
import { FIVE_MIN_IN_MS } from 'utils/time';
import { carbonApi } from 'services/carbonApi';
import { toUnixUTC } from 'components/simulator/utils';
import { startOfDay, subDays } from 'date-fns';
import { Token } from 'libs/tokens';

export const getMarketPrice = async (base: Token, quote: Token) => {
  const [basePrice, quotePrice] = await Promise.all([
    carbonApi.getMarketRate(base.address),
    carbonApi.getMarketRate(quote.address),
  ]);
  if (!basePrice || !quotePrice) {
    throw new Error(
      `Token price not available for ${base.address} or ${quote.address}`,
    );
  }
  return basePrice / quotePrice;
};

const getTokensPrice = async (
  prices: Record<string, number>,
  address?: string,
) => {
  if (!address) return;
  if (prices[address]) return prices[address];
  try {
    // need to await to enter the catch if needed
    return await carbonApi.getMarketRate(address);
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export const useGetTokenPrice = (address?: string) => {
  const pricesQuery = useGetTokensPrice();
  return useQuery({
    queryKey: QueryKey.tokenPrice(address),
    queryFn: async () => {
      const prices = pricesQuery.data ?? {};
      return await getTokensPrice(prices, address);
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

export const useGetMultipleTokenPrices = (addresses: string[] = []) => {
  return useQuery({
    queryKey: QueryKey.tokenListPrice(addresses),
    queryFn: async () => {
      const record: Record<string, number> = {};
      const getPrices: Promise<number>[] = [];
      for (const address of addresses) {
        const getPrice = carbonApi
          .getMarketRate(address)
          .then((price) => (record[address] = price));
        getPrices.push(getPrice);
      }
      await Promise.allSettled(getPrices);
      return record;
    },
    refetchInterval: FIVE_MIN_IN_MS,
    staleTime: FIVE_MIN_IN_MS,
    refetchOnWindowFocus: false,
    retry: 0, // Critical for initial load
  });
};
