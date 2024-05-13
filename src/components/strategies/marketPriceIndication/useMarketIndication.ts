import { useMemo } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { useUserMarketPrice } from '../UserMarketPrice';

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
  const marketPrice = useUserMarketPrice({ base, quote });
  const marketPriceNotZero = +marketPrice > 0;
  const isOrderAboveOrBelowMarketPrice = useMemo(() => {
    if (order.isRange) {
      const min = new SafeDecimal(order.min);
      const max = new SafeDecimal(order.max);
      const isInputNotZero = buy ? max.gt(0) : min.gt(0);
      if (!isInputNotZero || !marketPriceNotZero) return false;
      return buy ? max.gt(marketPrice) : min.lt(marketPrice);
    } else {
      const price = new SafeDecimal(order.price);
      if (!price.gt(0) || !marketPriceNotZero) return false;
      return buy ? price.gt(marketPrice) : price.lt(marketPrice);
    }
  }, [
    order.isRange,
    order.price,
    order.max,
    order.min,
    buy,
    marketPrice,
    marketPriceNotZero,
  ]);

  const marketPricePercentage = useMemo(
    () => ({
      min: marketPricePercent(order.min, marketPrice),
      max: marketPricePercent(order.max, marketPrice),
      price: marketPricePercent(order.price, marketPrice),
    }),
    [order.max, order.min, order.price, marketPrice]
  );

  return {
    isOrderAboveOrBelowMarketPrice,
    marketPricePercentage,
  };
};

export const marketPricePercent = (
  price: string,
  marketPrice: string | number
) => {
  const value = new SafeDecimal(price || 0);
  if (value.eq(0)) return value;
  if (+marketPrice === 0) return new SafeDecimal(0);
  return new SafeDecimal(value).minus(marketPrice).div(marketPrice).times(100);
};
