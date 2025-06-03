import { useMemo } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { formatNumber } from 'utils/helpers';
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

export const useMarketPercent = ({
  base,
  quote,
  order,
  buy = false,
}: UseMarketIndicationProps) => {
  const { marketPrice } = useMarketPrice({ base, quote });
  const isOrderAboveOrBelowMarketPrice = useMemo(() => {
    if (order.isRange) {
      const min = new SafeDecimal(order.min);
      const max = new SafeDecimal(order.max);
      const isInputNotZero = buy ? max.gt(0) : min.gt(0);
      if (!isInputNotZero || !marketPrice) return false;
      return buy ? max.gt(marketPrice) : min.lt(marketPrice);
    } else {
      const price = new SafeDecimal(order.price);
      if (!price.gt(0) || !marketPrice) return false;
      return buy ? price.gt(marketPrice) : price.lt(marketPrice);
    }
  }, [order.isRange, order.price, order.max, order.min, buy, marketPrice]);

  const marketPricePercentage = useMemo(
    () => ({
      min: marketPricePercent(order.min, marketPrice),
      max: marketPricePercent(order.max, marketPrice),
      price: marketPricePercent(order.price, marketPrice),
    }),
    [order.max, order.min, order.price, marketPrice],
  );

  return {
    isOrderAboveOrBelowMarketPrice,
    marketPricePercentage,
  };
};

export const marketPricePercent = (
  price?: string,
  marketPrice?: string | number,
) => {
  const value = new SafeDecimal(formatNumber(price ?? '') || 0);
  if (value.eq(0)) return value;
  if (!marketPrice) return new SafeDecimal(0);
  return new SafeDecimal(value).minus(marketPrice).div(marketPrice).times(100);
};
