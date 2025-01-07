import { Order, Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { formatNumber } from 'utils/helpers';
import { BaseOrder } from './types';
import { endOfDay, getUnixTime, startOfDay, subDays } from 'date-fns';
import { StrategyType } from 'libs/routing';

type StrategyOrderInput =
  | { min: string; max: string }
  | { startRate: string; endRate: string };
export interface StrategyInput {
  order0: StrategyOrderInput;
  order1: StrategyOrderInput;
}
export const isOverlappingStrategy = ({ order0, order1 }: StrategyInput) => {
  const buyHigh = 'endRate' in order0 ? order0.endRate : order0.max;
  const sellLow = 'startRate' in order1 ? order1.startRate : order1.min;
  if (!buyHigh || !sellLow) return false;
  const buyMax = new SafeDecimal(buyHigh);
  const sellMin = new SafeDecimal(sellLow);
  if (sellMin.eq(0)) return false; // Limit strategy with only buy
  if (buyMax.eq(0)) return false;
  return buyMax.gte(sellMin);
};

export const isDisposableStrategy = (strategy: Strategy) => {
  // If strategy is inactive, consider it as a recurring
  if (isEmptyOrder(strategy.order0) && isEmptyOrder(strategy.order1)) {
    return false;
  }
  if (isZero(strategy.order0.startRate)) return true;
  if (isZero(strategy.order0.endRate)) return true;
  if (isZero(strategy.order1.startRate)) return true;
  if (isZero(strategy.order1.endRate)) return true;
  return false;
};

export const getStrategyType = (strategy: Strategy): StrategyType => {
  if (isOverlappingStrategy(strategy)) return 'overlapping';
  if (isDisposableStrategy(strategy)) return 'disposable';
  return 'recurring';
};

export const isPaused = ({ order0, order1 }: Strategy) => {
  return (
    isZero(order0.startRate) &&
    isZero(order0.endRate) &&
    isZero(order0.marginalRate) &&
    isZero(order1.startRate) &&
    isZero(order1.endRate) &&
    isZero(order1.marginalRate)
  );
};

export const emptyOrder = (): BaseOrder => ({
  min: '0',
  max: '0',
  budget: '0',
});

export const toBaseOrder = (order: Order): BaseOrder => ({
  min: order.startRate,
  max: order.endRate,
  budget: order.balance,
});

export const isEmptyOrder = (order: Order) => {
  return !Number(order.startRate) && !Number(order.endRate);
};
export const isLimitOrder = (order: Order) => {
  return order.startRate === order.endRate;
};

/** Check if a string value is zero-like value, null or undefined */
export const isZero = (
  value?: string | null
): value is '' | '0' | '.' | undefined | null => {
  if (!value) return true;
  return !+formatNumber(value);
};

/** Check if a string value is zero-like value, but not empty string */
export const isTouchedZero = (value: string): value is '0' | '.' => {
  if (!value) return false;
  return !+formatNumber(value);
};

interface OutsideMarketParams {
  base?: Token;
  min?: string;
  max?: string;
  marketPrice?: number;
  buy?: boolean;
}
export const outSideMarketWarning = (params: OutsideMarketParams) => {
  const { base, min, max, marketPrice, buy } = params;
  if (!marketPrice) return;
  if (buy) {
    const price = isZero(max) ? min : max;
    if (isZero(price)) return;
    if (new SafeDecimal(price).gt(marketPrice)) {
      return `Notice: you offer to buy ${base?.symbol} above current market price`;
    }
  } else {
    const price = isZero(min) ? max : min;
    if (isZero(price)) return;
    if (new SafeDecimal(price).lt(marketPrice)) {
      return `Notice: you offer to sell ${base?.symbol} below current market price`;
    }
  }
};

export const resetPrice = (price?: string) => {
  return isZero(price) ? '' : price;
};

export const defaultStartDate = () => startOfDay(subDays(new Date(), 364));
export const defaultEndDate = () => endOfDay(new Date());
export const defaultStart = () => getUnixTime(defaultStartDate());
export const defaultEnd = () => getUnixTime(defaultEndDate());
