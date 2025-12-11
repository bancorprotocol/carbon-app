import { SafeDecimal } from 'libs/safedecimal';
import { useGetTokenPrice } from 'libs/queries/extApi/tokenPrice';
import { Token } from 'libs/tokens';
import { useCallback } from 'react';
import { getUsdPrice } from 'utils/helpers';

export const useFiatCurrency = (token?: Token) => {
  const tokenPriceQuery = useGetTokenPrice(token?.address);

  /** Verify that the token has a fiat value */
  const hasFiatValue = useCallback(() => {
    return typeof tokenPriceQuery.data === 'number';
  }, [tokenPriceQuery.data]);

  const getFiatValue = useCallback(
    (value?: string) => {
      const v = isNaN(Number(value)) ? 0 : value;
      return new SafeDecimal(v || 0).times(tokenPriceQuery.data || 0);
    },
    [tokenPriceQuery.data],
  );

  return {
    hasFiatValue,
    getFiatValue,
    getFiatAsString: (value?: string) => getUsdPrice(getFiatValue(value)),
  };
};
