import { useQueries, useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { FIVE_MIN_IN_MS } from 'utils/time';
import { useStore } from 'store';
import { carbonApi } from 'utils/carbonApi';

export const useCompareTokenPrice = (
  baseAddress: string,
  quoteAddress: string
) => {
  const basePrice = useGetTokenPrice(baseAddress).data?.USD;
  const quotePrice = useGetTokenPrice(quoteAddress).data?.USD;
  if (typeof basePrice !== 'number' || typeof quotePrice !== 'number') return;
  return basePrice / quotePrice;
};

export const useGetTokenPrice = (address?: string) => {
  const {
    fiatCurrency: { availableCurrencies, selectedFiatCurrency },
  } = useStore();

  return useQuery(
    [...QueryKey.tokenPrice(address!), selectedFiatCurrency],
    async () => carbonApi.getMarketRate(address!, [selectedFiatCurrency]),
    {
      enabled: !!address && availableCurrencies.length > 0,
      refetchInterval: FIVE_MIN_IN_MS,
      staleTime: FIVE_MIN_IN_MS,
    }
  );
};

export const useGetMultipleTokenPrices = (addresses: string[] = []) => {
  const {
    fiatCurrency: { availableCurrencies, selectedFiatCurrency },
  } = useStore();

  return useQueries({
    queries: addresses.map((address) => {
      return {
        queryKey: [...QueryKey.tokenPrice(address), selectedFiatCurrency],
        queryFn: () => carbonApi.getMarketRate(address, [selectedFiatCurrency]),
        enabled: !!address && availableCurrencies.length > 0,
        refetchInterval: FIVE_MIN_IN_MS,
        staleTime: FIVE_MIN_IN_MS,
      };
    }),
  });
};
