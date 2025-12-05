import { Token } from 'libs/tokens';
import { useGetTokenPrice } from 'libs/queries';

const getAddress = (token?: Token | string) => {
  return typeof token === 'string' ? token : token?.address;
};

interface Props {
  base?: Token | string;
  quote?: Token | string;
}
/** Return the market price of the base token in quote */
export const useMarketPrice = ({ base, quote }: Props) => {
  const baseQuery = useGetTokenPrice(getAddress(base));
  const quoteQuery = useGetTokenPrice(getAddress(quote));
  const basePrice = baseQuery.data;
  const quotePrice = quoteQuery.data;
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
