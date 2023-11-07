import BigNumber from 'bignumber.js';
import { useFiatCurrency } from './useFiatCurrency';
import { Token } from 'libs/tokens';

interface ComparePrice {
  base?: Token;
  quote?: Token;
}

export const useComparePrice = ({ base, quote }: ComparePrice) => {
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const { data: baseFiatMap } = useGetTokenPrice(base?.address);
  const { data: quotePriceMap } = useGetTokenPrice(quote?.address);
  return {
    baseFiat: new BigNumber(baseFiatMap?.[selectedFiatCurrency] ?? 0),
    quoteFiat: new BigNumber(quotePriceMap?.[selectedFiatCurrency] ?? 0),
  };
};
