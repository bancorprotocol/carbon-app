import { Token } from 'libs/tokens';
import { useFiatCurrency } from './useFiatCurrency';

interface Props {
  base?: Token;
  quote?: Token;
}
/** Return the market price of the base token in quote */
export const useMarketPrice = ({ base, quote }: Props) => {
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const { data: basePriceMap } = useGetTokenPrice(base?.address);
  const { data: quotePriceMap } = useGetTokenPrice(quote?.address);
  const basePrice = basePriceMap?.[selectedFiatCurrency];
  const quotePrice = quotePriceMap?.[selectedFiatCurrency];
  if (!basePrice || !quotePrice) return;
  return basePrice / quotePrice;
};
