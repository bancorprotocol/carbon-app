import {
  fromUnixUTC,
  toUnixUTC,
  toUnixUTCDay,
} from 'components/simulator/utils';
import {
  FormGradientOrder,
  QuickGradientOrderBlock,
  GradientOrderBlock,
} from '../types';
import { addDays, endOfDay, getUnixTime, isToday, startOfDay } from 'date-fns';
import { SafeDecimal } from 'libs/safedecimal';
import { StrategyDirection } from 'libs/routing';
import { Token } from 'libs/tokens';
import { isEmptyGradientOrder, isOrderInPast } from '../utils';
import config from 'config';

export const gradientMarginalPrice = (
  order: FormGradientOrder,
  date = new Date(),
) => {
  if (isEmptyGradientOrder(order)) return '0';
  if (isOrderInPast(order)) return '0';
  const { startPrice, endPrice } = order;
  const startDate = toUnixUTC(orderStartDate(order.startDate));
  const endDate = toUnixUTC(orderEndDate(order.endDate));
  // k = (endPrice - startPrice) / (startPrice * (endDate - startDate))
  const numerator = new SafeDecimal(endPrice).minus(startPrice);
  const denominator = new SafeDecimal(endDate).minus(startDate).mul(startPrice);
  const k = numerator.div(denominator);
  const deltaTime = new SafeDecimal(getUnixTime(date)).minus(startDate);
  // marginal = startPrice * (k * (now - startDate) + 1)
  const marginalPrice = new SafeDecimal(startPrice).mul(
    k.mul(deltaTime).add(1),
  );
  return marginalPrice.toString();
};

const today = new Date();
export const defaultGradientStartDate = toUnixUTCDay(addDays(today, 5));
export const defaultGradientEndDate = toUnixUTCDay(addDays(today, 50));

export interface GradientMultipliers {
  start: number;
  end: number;
}
export const defaultGradientMultipliers = (
  base: string,
  quote: string,
  direction: StrategyDirection = 'sell',
): GradientMultipliers => {
  const isStable = (token: string) => config.stableTokens.includes(token);
  const stablePair = isStable(base) && isStable(quote);
  if (stablePair) {
    return {
      start: direction === 'buy' ? 0.8 : 1.2,
      end: direction === 'buy' ? 0.98 : 1.02,
    };
  } else {
    return {
      start: direction === 'buy' ? 0.9 : 1.1,
      end: direction === 'buy' ? 0.99 : 1.01,
    };
  }
};

export const defaultGradientOrder = (
  baseOrder: Partial<GradientOrderBlock>,
  multipliers: GradientMultipliers,
  marketPrice: number = 0,
): GradientOrderBlock => {
  const direction = baseOrder.direction ?? 'sell';
  const price = new SafeDecimal(marketPrice);
  const order = {
    startPrice: baseOrder.startPrice ?? price.mul(multipliers.start).toString(),
    endPrice: baseOrder.endPrice ?? price.mul(multipliers.end).toString(),
    startDate: baseOrder.startDate ?? defaultGradientStartDate,
    endDate: baseOrder.endDate ?? defaultGradientEndDate,
    budget: baseOrder.budget ?? '',
    direction: direction,
  };
  return {
    ...order,
    marginalPrice: gradientMarginalPrice(order),
  };
};

export const orderStartDate = (timestamp: string) => {
  const date = fromUnixUTC(timestamp);
  return isToday(date) ? new Date() : startOfDay(date);
};
export const orderEndDate = (timestamp: string) => {
  return endOfDay(fromUnixUTC(timestamp));
};

type Line = Pick<
  GradientOrderBlock,
  'startDate' | 'endDate' | 'startPrice' | 'endPrice'
>;

/** Checks if the buy and sell lines overlap, and if the buy line is above the sell line at any point within the overlapping range */
export const isReverseGradientOrders = (buy: Line, sell: Line): boolean => {
  const startX = SafeDecimal.max(buy.startDate, sell.startDate);
  const endX = SafeDecimal.min(buy.endDate, sell.endDate);

  if (startX.gt(endX)) return false; // No overlap

  const buystartDate = new SafeDecimal(buy.startDate);
  const buyendDate = new SafeDecimal(buy.endDate);
  const buyStartPrice = new SafeDecimal(buy.startPrice);
  const buyEndPrice = new SafeDecimal(buy.endPrice);

  const sellstartDate = new SafeDecimal(sell.startDate);
  const sellendDate = new SafeDecimal(sell.endDate);
  const sellStartPrice = new SafeDecimal(sell.startPrice);
  const sellEndPrice = new SafeDecimal(sell.endPrice);

  const startXDecimal = new SafeDecimal(startX);
  const endXDecimal = new SafeDecimal(endX);

  const buyYStart = buyStartPrice.add(
    startXDecimal
      .sub(buystartDate)
      .mul(buyEndPrice.sub(buyStartPrice))
      .div(buyendDate.sub(buystartDate)),
  );
  const sellYStart = sellStartPrice.add(
    startXDecimal
      .sub(sellstartDate)
      .mul(sellEndPrice.sub(sellStartPrice))
      .div(sellendDate.sub(sellstartDate)),
  );
  const buyYEnd = buyStartPrice.add(
    endXDecimal
      .sub(buystartDate)
      .mul(buyEndPrice.sub(buyStartPrice))
      .div(buyendDate.sub(buystartDate)),
  );
  const sellYEnd = sellStartPrice.add(
    endXDecimal
      .sub(sellstartDate)
      .mul(sellEndPrice.sub(sellStartPrice))
      .div(sellendDate.sub(sellstartDate)),
  );

  if (buyYStart.greaterThan(sellYStart) || buyYEnd.greaterThan(sellYEnd)) {
    return true;
  }

  if (buyYStart.sub(sellYStart).mul(buyYEnd.sub(sellYEnd)).lessThan(0)) {
    return true;
  }

  return false;
};

export const gradientDateWarning = (order: FormGradientOrder) => {
  const startDate = orderStartDate(order.startDate);
  const endDate = orderEndDate(order.endDate);
  if (endDate < new Date()) return;
  if (startDate >= new Date()) return;
  if (new SafeDecimal(order.startPrice).gt(order.endPrice)) {
    return 'Your strategy is set to begin in the past, so the actual starting price will be lower than the specified starting price.';
  }
  if (new SafeDecimal(order.startPrice).lt(order.endPrice)) {
    return 'Your strategy is set to begin in the past, so the actual starting price will be higher than the specified starting price';
  }
};
export const gradientPriceWarning = (
  direction: StrategyDirection,
  order: FormGradientOrder,
  base: Token,
  marketPrice?: number,
) => {
  const startDate = fromUnixUTC(order.startDate);
  if (startDate > new Date()) return '';
  if (!marketPrice || !order.marginalPrice) return '';
  if (direction === 'buy') {
    if (new SafeDecimal(order.marginalPrice).gt(marketPrice)) {
      return `Notice: you offer to buy ${base.symbol} above current market price`;
    }
  } else {
    if (new SafeDecimal(order.marginalPrice).lt(marketPrice)) {
      return `Notice: you offer to sell ${base.symbol} below current market price`;
    }
  }
};
export const quickGradientPriceWarning = (
  direction: StrategyDirection,
  order: QuickGradientOrderBlock,
  base: Token,
  marketPrice?: number,
) => {
  if (!marketPrice || !order.marginalPrice) return '';
  if (direction === 'buy') {
    if (new SafeDecimal(order.marginalPrice).gt(marketPrice)) {
      return `Notice: you offer to buy ${base.symbol} above current market price`;
    }
  } else {
    if (new SafeDecimal(order.marginalPrice).lt(marketPrice)) {
      return `Notice: you offer to sell ${base.symbol} below current market price`;
    }
  }
};

export const gradientDateError = (order: FormGradientOrder) => {
  if (new Date() > orderEndDate(order.endDate)) {
    return 'Your order is set in the past and will never be active.';
  }
};

export const gradientDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
export const formatGradientDate = (timestamp: number | string) => {
  const date = fromUnixUTC(timestamp);
  return gradientDateFormatter.format(date);
};
