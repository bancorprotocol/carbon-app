import BigNumber from 'bignumber.js';
import { useGetTokenPrice } from 'libs/queries/extApi/tokenPrice';
import { Token } from 'libs/tokens';
import { useMemo } from 'react';
import { useStore } from 'store';
import { getFiatValue } from 'utils/helpers';

export const useFiatCurrency = (token?: Token, value?: string) => {
  const { fiatCurrency } = useStore();
  const { selectedFiatCurrency } = fiatCurrency;

  const tokenPriceQuery = useGetTokenPrice(token?.symbol);

  const fiatValue = useMemo(
    () =>
      new BigNumber(value || 0).times(
        tokenPriceQuery.data?.[selectedFiatCurrency] || 0
      ),
    [selectedFiatCurrency, tokenPriceQuery.data, value]
  );

  return {
    ...fiatCurrency,
    useGetTokenPrice,
    fiatValue,
    fiatAsString: getFiatValue(fiatValue, selectedFiatCurrency),
  };
};
