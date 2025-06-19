import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { formatNumber } from 'utils/helpers';
import {
  StaticOrder,
  BaseStrategy,
  FormStaticOrder,
  GradientOrder,
  FormOrder,
  FormGradientOrder,
  BuySellOrders,
} from './types';
import { fromUnixUTC } from 'components/simulator/utils';
import { startOfDay, subMonths, subYears } from 'date-fns';
import { toUnixUTC } from 'components/simulator/utils';
import { ChartPrices } from './d3Chart';

export interface StrategyInput {
  buy: { min: string; max: string };
  sell: { min: string; max: string };
}

type OrdersInput =
  | BuySellOrders<FormGradientOrder>
  | BuySellOrders<FormStaticOrder>;

export const isGradientStrategy = (
  strategy: OrdersInput,
): strategy is BuySellOrders<FormGradientOrder> => {
  return '_sD_' in strategy.buy;
};

export const isAuctionStrategy = (strategy: BaseStrategy<GradientOrder>) => {
  const isBuyEmpty = isEmptyGradientOrder(strategy.buy);
  const isSellEmpty = isEmptyGradientOrder(strategy.sell);
  return isBuyEmpty !== isSellEmpty;
};

export const isOverlappingStrategy = (strategy: OrdersInput) => {
  if (isGradientStrategy(strategy)) return false;
  const { buy, sell } = strategy;
  return isOverlappingOrders(buy, sell);
};
const isOverlappingOrders = (buy: FormStaticOrder, sell: FormStaticOrder) => {
  if (isZero(buy.max) || isZero(sell.min)) return false;

  const buyMin = new SafeDecimal(buy.min);
  const buyMax = new SafeDecimal(buy.max);
  if (buyMax.lt(sell.min)) return false;

  return (
    buyMin
      .div(sell.min)
      .toDecimalPlaces(2) // Round to 2 decimal places
      .times(1 + 0.01) // Apply 1% buffer above
      .gte(buyMax.div(sell.max).toDecimalPlaces(2)) &&
    buyMin
      .div(new SafeDecimal(sell.min))
      .toDecimalPlaces(2) // Round to 2 decimal places
      .times(1 - 0.01) // Apply 1% buffer below
      .lte(buyMax.div(sell.max).toDecimalPlaces(2))
  );
};

export const isDisposableStrategy = (strategy: OrdersInput) => {
  if (isGradientStrategy(strategy)) return false;
  // If strategy is inactive, consider it as a recurring
  if (isEmptyOrder(strategy.buy) && isEmptyOrder(strategy.sell)) {
    return false;
  }
  if (isZero(strategy.buy.min)) return true;
  if (isZero(strategy.buy.max)) return true;
  if (isZero(strategy.sell.min)) return true;
  if (isZero(strategy.sell.max)) return true;
  return false;
};

export const isFullRangeStrategy = (buy?: FormOrder, sell?: FormOrder) => {
  if (!buy || !sell) return false;
  if (isGradientOrder(buy) || isGradientOrder(sell)) return false;
  if (!isOverlappingOrders(buy, sell)) return false;
  return isFullRange(buy.min, sell.max);
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

export const getStrategyType = (strategy: OrdersInput) => {
  if (isGradientStrategy(strategy)) return 'gradient';
  if (isOverlappingStrategy(strategy)) return 'overlapping';
  if (isDisposableStrategy(strategy)) return 'disposable';
  return 'recurring';
};

export const isPaused = (strategy: OrdersInput) => {
  if (isGradientStrategy(strategy)) {
    return (
      isZero(strategy.buy._sP_) &&
      isZero(strategy.buy._eP_) &&
      isZero(strategy.sell._sP_) &&
      isZero(strategy.sell._eP_)
    );
  } else {
    return (
      isZero(strategy.buy.min) &&
      isZero(strategy.buy.max) &&
      isZero(strategy.buy.marginalPrice) &&
      isZero(strategy.sell.min) &&
      isZero(strategy.sell.max) &&
      isZero(strategy.sell.marginalPrice)
    );
  }
};
export const isInPast = (strategy: BaseStrategy<GradientOrder>) => {
  if (!isEmptyGradientOrder(strategy.buy)) {
    if (fromUnixUTC(strategy.buy._eD_) < new Date()) return true;
  }
  if (!isEmptyGradientOrder(strategy.sell)) {
    if (fromUnixUTC(strategy.sell._eD_) < new Date()) return true;
  }
  return false;
};

export const isStaticOrder = (order: FormOrder): order is FormStaticOrder => {
  return 'min' in order;
};
export const isGradientOrder = (
  order: FormOrder,
): order is FormGradientOrder => {
  return '_sD_' in order;
};
export const emptyOrder = (): FormStaticOrder => ({
  min: '0',
  max: '0',
  budget: '0',
});
export const emptyGradientOrder = () => ({
  _sP_: '0',
  _eP_: '0',
  _sD_: '0',
  _eD_: '0',
  budget: '0',
});
export const isEmptyOrder = (order: FormStaticOrder) => {
  return !Number(order.min) && !Number(order.max);
};
export const isEmptyGradientOrder = (order: FormGradientOrder) => {
  return !Number(order._sP_) && !Number(order._eP_);
};
export const isLimitOrder = (order: StaticOrder) => {
  return order.min === order.max;
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
  isBuy?: boolean;
}
export const outSideMarketWarning = (params: OutsideMarketParams) => {
  const { base, min, max, marketPrice, isBuy } = params;
  if (!marketPrice) return;
  if (isBuy) {
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

export const default_SD_ = () => startOfDay(subMonths(new Date(), 3));
export const default_ED_ = () => startOfDay(new Date());
export const defaultStart = () => toUnixUTC(default_SD_());
export const defaultEnd = () => toUnixUTC(default_ED_());
export const oneYearAgo = () => toUnixUTC(startOfDay(subYears(new Date(), 1)));

export const getBounds = (
  buyOrder?: FormOrder,
  sellOrder?: FormOrder,
  direction?: 'none' | 'buy' | 'sell',
): ChartPrices => {
  const getMinMax = (order?: FormOrder) => {
    if (!order) return;
    if (!isGradientOrder(order)) return order;
    return {
      min: SafeDecimal.min(order._sP_, order._eP_).toString(),
      max: SafeDecimal.max(order._sP_, order._eP_).toString(),
    };
  };
  const buy = getMinMax(buyOrder);
  const sell = getMinMax(sellOrder);
  if (direction === 'none') {
    return {
      buy: { min: '', max: '' },
      sell: { min: '', max: '' },
    };
  } else if (direction === 'buy') {
    return {
      buy: { min: buy?.min || '', max: buy?.max || '' },
      sell: { min: '', max: '' },
    };
  } else if (direction === 'sell') {
    return {
      buy: { min: '', max: '' },
      sell: { min: sell?.min || '', max: sell?.max || '' },
    };
  } else if (isFullRangeStrategy(buyOrder, sellOrder)) {
    return {
      buy: { min: '', max: '' },
      sell: { min: '', max: '' },
    };
  } else {
    return {
      buy: { min: buy?.min || '', max: buy?.max || '' },
      sell: { min: sell?.min || '', max: sell?.max || '' },
    };
  }
};
