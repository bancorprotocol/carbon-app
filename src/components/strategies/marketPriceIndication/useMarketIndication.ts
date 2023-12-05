import { useMemo } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { useGetTokenPrice } from 'libs/queries';
import { Token } from 'libs/tokens';
import { useFiatCurrency } from '../../../hooks/useFiatCurrency';

export type MarketPricePercentage = {
  min: SafeDecimal;
  max: SafeDecimal;
  price: SafeDecimal;
};

type UseMarketIndicationProps = {
  base: Token | undefined;
  quote: Token | undefined;
  order: {
    isRange: boolean;
    min: string;
    max: string;
    price: string;
  };
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
        ? new SafeDecimal(order.max).gt(0)
        : new SafeDecimal(order.min).gt(0);

      const isAboveOrBelow = buy
        ? new SafeDecimal(getFiatValue(order.max)).gt(tokenMarketPrice)
        : new SafeDecimal(getFiatValue(order.min)).lt(tokenMarketPrice);

      return isInputNotZero && isAboveOrBelow;
    }
    return (
      new SafeDecimal(order.price).gt(0) &&
      new SafeDecimal(getFiatValue(order.price))[buy ? 'gt' : 'lt'](
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
        : new SafeDecimal(fiatValue)
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
