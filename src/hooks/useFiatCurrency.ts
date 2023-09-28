import BigNumber from 'bignumber.js';
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
      const currency = usd ? availableCurrencies[0] : selectedFiatCurrency;
      const fiatValue = tokenPriceQuery.data?.[currency];
      // TODO: return undefined instead
      if (!fiatValue) return new BigNumber(0);
      return new BigNumber(value || 0).times(fiatValue);
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
