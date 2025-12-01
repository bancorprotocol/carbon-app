import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { getUsdPrice } from 'utils/helpers';
import { useGetTokenPrice } from 'libs/queries';

interface FiatValueParams {
  token: Token;
  price?: string;
  highPrecision?: boolean;
}

export const useFiatValue = (params: FiatValueParams) => {
  const { price, token, highPrecision } = params;
  const query = useGetTokenPrice(token.address);
  if (!price || !query.isPending || !query.data) return;
  const value = new SafeDecimal(price).times(query.data);
  return getUsdPrice(value, {
    highPrecision,
  });
};
