import { SafeDecimal } from 'libs/safedecimal';
import { useGetTokenPrice } from 'libs/queries/extApi/tokenPrice';
import { Token } from 'libs/tokens';
import { useCallback } from 'react';
import { useStore } from 'store';
import { getFiatDisplayValue } from 'utils/helpers';

export const useFiatCurrency = (token?: Token) => {
  const { fiatCurrency } = useStore();

  const { selectedFiatCurrency, availableCurrencies } = fiatCurrency;

  const tokenPriceQuery = useGetTokenPrice(token?.address);

  /** Verify that the token has a fiat value */
  const hasFiatValue = useCallback(() => {
    return typeof tokenPriceQuery.data?.[selectedFiatCurrency] === 'number';
  }, [selectedFiatCurrency, tokenPriceQuery.data]);

  const getFiatValue = useCallback(
    (value?: string, usd = false) => {
      const v = isNaN(Number(value)) ? 0 : value;
      return new SafeDecimal(v || 0).times(
        tokenPriceQuery.data?.[
          usd ? availableCurrencies[0] : selectedFiatCurrency
        ] || 0,
      );
    },
    [availableCurrencies, selectedFiatCurrency, tokenPriceQuery.data],
  );

  return {
    ...fiatCurrency,
    useGetTokenPrice,
    hasFiatValue,
    getFiatValue,
    getFiatAsString: (value?: string) =>
      getFiatDisplayValue(getFiatValue(value), selectedFiatCurrency),
  };
};
