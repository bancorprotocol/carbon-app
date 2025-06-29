import { Token } from 'libs/tokens';
import { useStore } from 'store';
import { useGetTokenPrice } from 'libs/queries';

interface Props {
  base?: Token | string;
  quote?: Token | string;
}
/** Return the market price of the base token in quote */
export const useMarketPrice = ({ base, quote }: Props) => {
  const { fiatCurrency } = useStore();
  const getAddress = (token?: Token | string) =>
    typeof token === 'string' ? token : token?.address;
  const baseQuery = useGetTokenPrice(getAddress(base));
  const quoteQuery = useGetTokenPrice(getAddress(quote));
  const basePrice = baseQuery.data?.[fiatCurrency.selectedFiatCurrency];
  const quotePrice = quoteQuery.data?.[fiatCurrency.selectedFiatCurrency];
  const isPending = baseQuery.isPending || quoteQuery.isPending;
  const isError = baseQuery.isError || quoteQuery.isError;
  if (!basePrice || !quotePrice) {
    return { marketPrice: undefined, isPending, isError };
  }
  return {
    marketPrice: basePrice / quotePrice,
    isPending,
    isError,
  };
};
