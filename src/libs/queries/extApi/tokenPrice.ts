import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { THIRTY_SEC_IN_MS } from 'utils/time';
import { FiatPriceDict } from 'store/useFiatCurrencyStore';
import { useStore } from 'store';
import { cryptoCompareAxios } from 'utils/cryptoCompare';

export const useGetTokenPrice = (symbol?: string) => {
  const {
    fiatCurrency: { availableCurrencies },
  } = useStore();

  return useQuery(
    QueryKey.tokenPrice(symbol!),
    async () => {
      const result = await cryptoCompareAxios.get<FiatPriceDict>('data/price', {
        params: { fsym: symbol, tsyms: availableCurrencies.join(',') },
      });

      return result.data;
    },
    {
      enabled: !!symbol && availableCurrencies.length > 0,
      refetchInterval: THIRTY_SEC_IN_MS,
    }
  );
};
