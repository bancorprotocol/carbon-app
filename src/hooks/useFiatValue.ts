import BigNumber from 'bignumber.js';
import { useFiatCurrency } from './useFiatCurrency';
import { Token } from 'libs/tokens';
import { getFiatDisplayValue } from 'utils/helpers';

interface FiatValueParams {
  token: Token;
  price?: string;
}

export const useFiatPrice = (token?: Token) => {
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const { data: fiatPriceMap } = useGetTokenPrice(token?.address);
  return fiatPriceMap?.[selectedFiatCurrency] || 0;
};

export const useFiatValue = ({ price, token }: FiatValueParams) => {
  const { selectedFiatCurrency } = useFiatCurrency();
  const fiatPrice = useFiatPrice(token);
  const value = new BigNumber(price || 0).times(fiatPrice);
  return getFiatDisplayValue(value, selectedFiatCurrency);
};
