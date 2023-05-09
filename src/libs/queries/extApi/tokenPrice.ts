import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { THIRTY_SEC_IN_MS } from 'utils/time';
import { FiatPriceDict } from 'store/useFiatCurrencyStore';
import { useStore } from 'store';
import axios from 'axios';

export const useGetTokenPrice = (address?: string) => {
  const {
    fiatCurrency: { availableCurrencies },
  } = useStore();

  return useQuery(
    QueryKey.tokenPrice(address!),
    async () => {
      const result = await axios.get<{ data: FiatPriceDict }>(
        `api/marketrate/${address}`,
        {
          params: { convert: availableCurrencies.join(',') },
        }
      );

      return result.data.data;
    },
    {
      enabled: !!address && availableCurrencies.length > 0,
      refetchInterval: THIRTY_SEC_IN_MS,
    }
  );
};
