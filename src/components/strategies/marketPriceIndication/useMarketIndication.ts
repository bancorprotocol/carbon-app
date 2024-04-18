import { useMemo } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { useMarketPrice } from 'hooks/useMarketPrice';

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
  const marketPrice = useMarketPrice({ base, quote });
  const isOrderAboveOrBelowMarketPrice = useMemo(() => {
    if (order.isRange) {
      const min = new SafeDecimal(order.min);
      const max = new SafeDecimal(order.max);
      const isInputNotZero = buy ? max.gt(0) : min.gt(0);
      if (!isInputNotZero) return false;
      return buy ? max.gt(marketPrice) : min.lt(marketPrice);
    } else {
      const price = new SafeDecimal(order.price);
      if (!price.gt(0)) return false;
      return buy ? price.gt(marketPrice) : price.lt(marketPrice);
    }
  }, [order.isRange, order.price, order.max, order.min, buy, marketPrice]);

  const marketPricePercentage = useMemo(() => {
    const getMarketPricePercentage = (price: string) => {
      const value = new SafeDecimal(price || 0);
      if (value.eq(0)) return value;
      return new SafeDecimal(value)
        .minus(marketPrice)
        .div(marketPrice)
        .times(100);
    };
    return {
      min: getMarketPricePercentage(order.min),
      max: getMarketPricePercentage(order.max),
      price: getMarketPricePercentage(order.price),
    };
  }, [order.max, order.min, order.price, marketPrice]);

  return {
    isOrderAboveOrBelowMarketPrice,
    marketPricePercentage,
  };
};
