import { BaseStrategy, Order, Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { formatNumber } from 'utils/helpers';
import { BaseOrder } from './types';
import { startOfDay, subMonths, subYears } from 'date-fns';
import { toUnixUTC } from 'components/simulator/utils';
import { ChartPrices } from './d3Chart';

type StrategyOrderInput =
  | { min: string; max: string }
  | { startRate: string; endRate: string };
export interface StrategyInput {
  order0: StrategyOrderInput;
  order1: StrategyOrderInput;
}
export const isOverlappingStrategy = ({ order0, order1 }: StrategyInput) => {
  const buyLow = 'startRate' in order0 ? order0.startRate : order0.min;
  const buyHigh = 'endRate' in order0 ? order0.endRate : order0.max;
  const sellLow = 'startRate' in order1 ? order1.startRate : order1.min;
  const sellHigh = 'endRate' in order1 ? order1.endRate : order1.max;
  if (isZero(buyHigh) || isZero(sellLow)) return false;

  const buyMin = new SafeDecimal(buyLow);
  const buyMax = new SafeDecimal(buyHigh);
  if (buyMax.lt(sellLow)) return false;

  return (
    buyMin
      .div(sellLow)
      .toDecimalPlaces(2) // Round to 2 decimal places
      .times(1 + 0.01) // Apply 1% buffer above
      .gte(buyMax.div(sellHigh).toDecimalPlaces(2)) &&
    buyMin
      .div(new SafeDecimal(sellLow))
      .toDecimalPlaces(2) // Round to 2 decimal places
      .times(1 - 0.01) // Apply 1% buffer below
      .lte(buyMax.div(sellHigh).toDecimalPlaces(2))
  );
};

export const isFullRangeStrategy = (
  order0: BaseOrder | Order,
  order1: BaseOrder | Order,
) => {
  if (!isOverlappingStrategy({ order0, order1 })) return false;
  const min = 'min' in order0 ? order0.min : order0.startRate;
  const max = 'max' in order1 ? order1.max : order1.endRate;
  return isFullRange(min, max);
};

/** Check if an existing strategy is full range. For create & update use isFullRangeCreation instead to check the marketprice */
export const isFullRange = (min: string | number, max: string | number) => {
  const range = new SafeDecimal(max).div(min);
  // These values are based on the 1000 factor we use to create full range
  return range.gte(999_000) && range.lte(1_000_100);
};

export const isFullRangeCreation = (
  min: string | number,
  max: string | number,
  marketPrice?: string | number,
) => {
  if (!marketPrice) return false;
  const minRatio = new SafeDecimal(marketPrice).div(min);
  if (minRatio.lt(990) || minRatio.gt(1010)) return false;
  const maxRatio = new SafeDecimal(max).div(marketPrice);
  if (maxRatio.lt(990) || maxRatio.gt(1010)) return false;
  return true;
};

export const isDisposableStrategy = (
  strategy: Pick<BaseStrategy, 'order0' | 'order1'>,
) => {
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

export const getStrategyType = (
  strategy: Pick<BaseStrategy, 'order0' | 'order1'>,
) => {
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

export const toOrder = (order: BaseOrder): Order => ({
  balance: order.budget,
  startRate: order.min,
  endRate: order.max,
  marginalRate: order.marginalPrice ?? '',
});

export const isEmptyOrder = (order: Order) => {
  return !Number(order.startRate) && !Number(order.endRate);
};
export const isLimitOrder = (order: Order) => {
  return order.startRate === order.endRate;
};

/** Check if a string value is zero-like value, null or undefined */
export const isZero = (
  value?: string | null,
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
  marketPrice?: string | number;
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

export const defaultStartDate = () => startOfDay(subMonths(new Date(), 3));
export const defaultEndDate = () => startOfDay(new Date());
export const defaultStart = () => toUnixUTC(defaultStartDate());
export const defaultEnd = () => toUnixUTC(defaultEndDate());
export const oneYearAgo = () => toUnixUTC(startOfDay(subYears(new Date(), 1)));

export const getBounds = (
  order0: BaseOrder,
  order1: BaseOrder,
  direction?: 'none' | 'buy' | 'sell',
): ChartPrices => {
  if (direction === 'none') {
    return {
      buy: { min: '', max: '' },
      sell: { min: '', max: '' },
    };
  } else if (direction === 'buy') {
    return {
      buy: { min: order0.min, max: order0.max },
      sell: { min: '', max: '' },
    };
  } else if (direction === 'sell') {
    return {
      buy: { min: '', max: '' },
      sell: { min: order1.min, max: order1.max },
    };
  } else if (isFullRangeStrategy(order0, order1)) {
    return {
      buy: { min: '', max: '' },
      sell: { min: '', max: '' },
    };
  } else {
    return {
      buy: { min: order0.min, max: order0.max },
      sell: { min: order1.min, max: order1.max },
    };
  }
};
