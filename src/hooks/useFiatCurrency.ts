import { SafeDecimal } from 'libs/safedecimal';
import { useGetTokenPrice } from 'libs/queries/extApi/tokenPrice';
import { Token } from 'libs/tokens';
import { useMemo } from 'react';
import { useStore } from 'store';
import { getFiatDisplayValue } from 'utils/helpers';

export const useFiatCurrency = (token?: Token) => {
  const { fiatCurrency } = useStore();

  const { selectedFiatCurrency, availableCurrencies } = fiatCurrency;

  const tokenPriceQuery = useGetTokenPrice(token?.address);

  const getFiatValue = useMemo(() => {
    return (value: string, usd = false) => {
      return new SafeDecimal(value || 0).times(
        tokenPriceQuery.data?.[
          usd ? availableCurrencies[0] : selectedFiatCurrency
        ] || 0
      );
    };
  }, [availableCurrencies, selectedFiatCurrency, tokenPriceQuery.data]);

  return {
    ...fiatCurrency,
    useGetTokenPrice,
    getFiatValue,
    getFiatAsString: (value: string) =>
      getFiatDisplayValue(getFiatValue(value), selectedFiatCurrency),
  };
};
