import { SafeDecimal } from 'libs/safedecimal';
import { useFiatCurrency } from './useFiatCurrency';
import { Token } from 'libs/tokens';
import { getFiatDisplayValue } from 'utils/helpers';

interface FiatValueParams {
  token: Token;
  price?: string;
}

export const useFiatValue = ({ price, token }: FiatValueParams) => {
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const { data: fiatPriceMap } = useGetTokenPrice(token.address);
  const fiatPrice = fiatPriceMap?.[selectedFiatCurrency] || 0;
  const value = new SafeDecimal(price || 0).times(fiatPrice);
  return getFiatDisplayValue(value, selectedFiatCurrency);
};
