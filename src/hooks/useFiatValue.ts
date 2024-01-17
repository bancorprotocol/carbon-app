import { SafeDecimal } from 'libs/safedecimal';
import { useFiatCurrency } from './useFiatCurrency';
import { Token } from 'libs/tokens';
import { prettifyNumber } from 'utils/helpers';

interface FiatValueParams {
  token: Token;
  price?: string;
  highPrecision?: boolean;
}

export const useFiatValue = (params: FiatValueParams) => {
  const { price, token, highPrecision } = params;
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const { data: fiatPriceMap } = useGetTokenPrice(token.address);
  const fiatPrice = fiatPriceMap?.[selectedFiatCurrency] || 0;
  const value = new SafeDecimal(price || 0).times(fiatPrice);
  return prettifyNumber(value, {
    currentCurrency: selectedFiatCurrency,
    highPrecision,
  });
};
