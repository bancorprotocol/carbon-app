import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useGetTokenPrice } from 'libs/queries';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from '../../hooks/useFiatCurrency';
import { OrderCreate } from 'components/strategies/create/useOrder';

export type MarketPricePercentage = {
  min: BigNumber;
  max: BigNumber;
  price: BigNumber;
};

type UseMarketIndicationProps = {
  base: Token | undefined;
  quote: Token | undefined;
  order: OrderCreate;
  buy?: boolean;
};

export const useMarketIndication = ({
  base,
  quote,
  order,
  buy = false,
}: UseMarketIndicationProps) => {
  const baseTokenPriceQuery = useGetTokenPrice(base?.address);
  const { getFiatValue, selectedFiatCurrency } = useFiatCurrency(quote);
  const tokenMarketPrice =
    baseTokenPriceQuery?.data?.[selectedFiatCurrency] || 0;

  const isOrderAboveOrBelowMarketPrice = useMemo(() => {
    if (order.isRange) {
      const isInputNotZero = buy
        ? new BigNumber(order.max).gt(0)
        : new BigNumber(order.min).gt(0);

      const isAboveOrBelow = buy
        ? new BigNumber(getFiatValue(order.max)).gt(tokenMarketPrice)
        : new BigNumber(getFiatValue(order.min)).lt(tokenMarketPrice);

      return isInputNotZero && isAboveOrBelow;
    }

    return (
      new BigNumber(order.price).gt(0) &&
      new BigNumber(getFiatValue(order.price))[buy ? 'gt' : 'lt'](
        tokenMarketPrice
      )
    );
  }, [
    order.isRange,
    order.price,
    order.max,
    order.min,
    getFiatValue,
    buy,
    tokenMarketPrice,
  ]);

  const marketPricePercentage = useMemo(() => {
    const getMarketPricePercentage = (price: string) => {
      const fiatValue = getFiatValue(price);
      return fiatValue.eq(0)
        ? fiatValue
        : new BigNumber(fiatValue)
            .minus(tokenMarketPrice)
            .div(tokenMarketPrice)
            .times(100);
    };

    return {
      min: getMarketPricePercentage(order.min),
      max: getMarketPricePercentage(order.max),
      price: getMarketPricePercentage(order.price),
    };
  }, [getFiatValue, order.max, order.min, order.price, tokenMarketPrice]);

  return {
    isOrderAboveOrBelowMarketPrice,
    marketPricePercentage,
  };
};
