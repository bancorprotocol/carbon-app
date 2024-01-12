import { Token } from 'libs/tokens';
import { useFiatCurrency } from './useFiatCurrency';
import { FiatSymbol, carbonApi } from 'utils/carbonApi';

interface Props {
  base?: Token;
  quote?: Token;
}
/** Return the market price of the base token in quote */
export const useMarketPrice = ({ base, quote }: Props) => {
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const { data: basePriceMap } = useGetTokenPrice(base?.address);
  const { data: quotePriceMap } = useGetTokenPrice(quote?.address);
  const basePrice = basePriceMap?.[selectedFiatCurrency] || 0;
  const quotePrice = quotePriceMap?.[selectedFiatCurrency] || 0;
  if (!basePrice || !quotePrice) return 0;
  return basePrice / quotePrice;
};

/** Return the market price of the base token in quote */
export const getMarketPrice = async (
  base: Token,
  quote: Token,
  currency: FiatSymbol
) => {
  const [basePriceMap, quotePriceMap] = await Promise.all([
    carbonApi.getMarketRate(base.address, [currency]),
    carbonApi.getMarketRate(quote.address, [currency]),
  ]);
  const basePrice = basePriceMap?.[currency] || 0;
  const quotePrice = quotePriceMap?.[currency] || 0;
  if (!basePrice || !quotePrice) return 0;
  return basePrice / quotePrice;
};
