import { fromUnixUTC, toUnixUTCDay } from 'components/simulator/utils';
import {
  FormGradientOrder,
  QuickGradientOrderBlock,
  GradientOrderBlock,
} from '../types';
import { addDays, endOfDay, isToday, startOfDay } from 'date-fns';
import { SafeDecimal } from 'libs/safedecimal';
import { StrategyDirection } from 'libs/routing';
import { Token } from 'libs/tokens';
import { isEmptyGradientOrder } from '../utils';

export const gradientMarginalPrice = (order: FormGradientOrder) => {
  if (isEmptyGradientOrder(order)) return '0';
  return '0'; // @todo(gradient) we should use the sdk if possible
};

export const defaultGradientOrder = (
  baseOrder: Partial<GradientOrderBlock>,
  marketPrice: string = '0',
): GradientOrderBlock => {
  const direction = baseOrder.direction ?? 'sell';
  const today = new Date();
  const startMultiplier = direction === 'buy' ? 0.9 : 1.1;
  const endMultiplier = direction === 'buy' ? 0.99 : 1.01;
  const price = new SafeDecimal(marketPrice);
  const order = {
    _sP_: baseOrder._sP_ ?? price.mul(startMultiplier).toString(),
    _eP_: baseOrder._eP_ ?? price.mul(endMultiplier).toString(),
    _sD_: baseOrder._sD_ ?? toUnixUTCDay(addDays(today, 1)),
    _eD_: baseOrder._eD_ ?? toUnixUTCDay(addDays(today, 21)),
    budget: baseOrder.budget ?? '',
    direction: direction,
  };
  return {
    ...order,
    marginalPrice: gradientMarginalPrice(order),
  };
};

export const order_SD_ = (timestamp: string) => {
  const date = fromUnixUTC(timestamp);
  return isToday(date) ? new Date() : startOfDay(date);
};
export const order_ED_ = (timestamp: string) => {
  return endOfDay(fromUnixUTC(timestamp));
};

type Line = Pick<GradientOrderBlock, '_sD_' | '_eD_' | '_sP_' | '_eP_'>;

/** Checks if the buy and sell lines overlap, and if the buy line is above the sell line at any point within the overlapping range */
export const isReverseGradientOrders = (buy: Line, sell: Line): boolean => {
  // @todo(gradient)
  return false;
};

export const gradientDateWarning = (order: FormGradientOrder) => {
  const _sD_ = order_SD_(order._sD_);
  const _eD_ = order_ED_(order._eD_);
  if (_eD_ < new Date()) return;
  if (_sD_ >= new Date()) return;
  if (new SafeDecimal(order._sP_).gt(order._eP_)) {
    // @todo(gradient)
    return '';
  }
  if (new SafeDecimal(order._sP_).lt(order._eP_)) {
    // @todo(gradient)
    return '';
  }
};
export const gradientPriceWarning = (
  direction: StrategyDirection,
  order: FormGradientOrder,
  base: Token,
  marketPrice?: number,
) => {
  // @todo(gradient)
  return '';
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
  if (new Date() > order_ED_(order._eD_)) {
    // @todo(gradient)
    return '';
  }
};
