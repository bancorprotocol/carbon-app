import Decimal from 'decimal.js';
import { useFiatCurrency } from './useFiatCurrency';
import { Token } from 'libs/tokens';
import { getFiatDisplayValue } from 'utils/helpers';

interface FiatPriceParams {
  token: Token;
  price?: string;
}

export const useFiatPrice = ({ price, token }: FiatPriceParams) => {
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const { data: fiatPriceMap } = useGetTokenPrice(token.address);
  const fiatPrice = fiatPriceMap?.[selectedFiatCurrency] || 0;
  const value = new Decimal(price || 0).times(fiatPrice);
  return getFiatDisplayValue(value, selectedFiatCurrency);
};
