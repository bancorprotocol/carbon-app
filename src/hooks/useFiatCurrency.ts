import { useStore } from 'store';
import { useGetTokenPrice } from 'libs/queries/extApi/tokenPrice';

export const useFiatCurrency = () => {
  const { fiatCurrency } = useStore();

  return { ...fiatCurrency, useGetTokenPrice };
};
