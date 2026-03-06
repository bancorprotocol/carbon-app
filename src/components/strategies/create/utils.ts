import { Dispatch, SetStateAction } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';
import { NavigateOptions } from 'libs/routing';
import {
  StrategyDirection,
  StrategySettings,
  TradeOverlappingSearch,
} from 'libs/routing/routes/trade';
import { isValidRange } from '../utils';
import { Token } from 'libs/tokens';
import { getFullRangesPrices, isZero } from '../common/utils';
import {
  defaultSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from '../overlapping/utils';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { SafeDecimal } from 'libs/safedecimal';
import {
  OrderBlock,
  CreateOverlappingOrder,
  StaticOrder,
} from '../common/types';

export const handleTxStatusAndRedirectToOverview = (
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  navigate?: (opts: NavigateOptions) => Promise<void>,
) => {
  setIsProcessing(true);
  setTimeout(() => {
    setIsProcessing(false);
    navigate?.({ to: '/portfolio/strategies', params: {}, search: {} });
  }, ONE_AND_A_HALF_SECONDS_IN_MS);
};

const getRecurringPreset = (
  direction: StrategyDirection,
  settings: StrategySettings,
) => {
  if (settings === 'range') {
    return {
      min: direction === 'buy' ? 0.05 : 0.01,
      max: direction === 'buy' ? 0.01 : 0.05,
    };
  } else {
    return {
      min: 0.01,
      max: 0.01,
    };
  }
};

// search preset * marketPrice > search prices > strategy > default preset * price > default preset * marketPrice
export const getEditRecurringPrices = (
  order: Partial<OrderBlock>,
  baseOrder: StaticOrder,
  marketPrice: string = '0',
) => {
  const direction = order.direction ?? 'sell';
  // Settings is only used when there is no prices in the strategy
  const settings = order.settings ?? 'limit';
  const presets = getRecurringPreset(direction, settings);
  const getMultiplier = (value: string | number) => {
    if (direction === 'buy') {
      return new SafeDecimal(1).minus(value);
    } else {
      return new SafeDecimal(1).add(value);
    }
  };
  const getPrice = (preset: string | number, priceRef: string) => {
    return getMultiplier(preset).mul(priceRef).toString();
  };
  const getMin = () => {
    // 1: Search preset * marketPrice
    if (order.presetMin) return getPrice(order.presetMin, marketPrice);
    // 2: Search price
    if (!isZero(order.min)) return order.min;
    // 3. Strategy Price
    if (!isZero(baseOrder.min)) {
      if (direction === 'sell') return baseOrder.min;
      if (settings === 'limit') return baseOrder.min;
      // 4. default preset * default price
      return getPrice(presets.min, baseOrder.max);
    }
    // 5. default preset * marketPrice
    return getPrice(presets.min, marketPrice);
  };
  const getMax = () => {
    // 1: Search preset * marketPrice
    if (order.presetMax) return getPrice(order.presetMax, marketPrice);
    // 2: Search price
    if (!isZero(order.max)) return order.max;
    // 3. Strategy Price
    if (!isZero(baseOrder.max)) {
      if (direction === 'buy') return baseOrder.max;
      if (settings === 'limit') return baseOrder.max;
      // 4. default preset * default price
      return getPrice(presets.max, baseOrder.min);
    }
    // 5. default preset * marketPrice
    return getPrice(presets.max, marketPrice);
  };
  return {
    min: getMin(),
    max: getMax(),
  };
};

// search preset > search prices > default preset
const getTradeRecurringPrices = (
  order: Partial<OrderBlock>,
  marketPrice: number | string,
) => {
  const direction = order.direction ?? 'sell';
  const settings = order.settings ?? 'limit';
  const presets = getRecurringPreset(direction, settings);
  const presetMin = order.presetMin || presets.min;
  const presetMax = order.presetMax || presets.max;
  const getMultiplier = (value: string | number) => {
    if (direction === 'buy') {
      return new SafeDecimal(1).minus(value);
    } else {
      return new SafeDecimal(1).add(value);
    }
  };
  return {
    min: getMultiplier(presetMin).mul(marketPrice).toString(),
    max: getMultiplier(presetMax).mul(marketPrice).toString(),
  };
};

export const getTradeOrder = (
  order: Partial<OrderBlock>,
  marketPrice: number | string = 0,
): OrderBlock => {
  const prices = getTradeRecurringPrices(order, marketPrice);
  return {
    min: order.min ?? prices.min,
    max: order.max ?? prices.max,
    budget: order.budget ?? '',
    settings: order.settings ?? 'limit',
  };
};

export const defaultPreset = 0.01;

/** Create the orders out of the search params */
export const getOverlappingOrders = (
  search: TradeOverlappingSearch,
  base?: Token,
  quote?: Token,
  marketPrice?: number,
): { buy: CreateOverlappingOrder; sell: CreateOverlappingOrder } => {
  if (!base || !quote || !marketPrice) {
    return {
      buy: { min: '', max: '', marginalPrice: '', budget: '' },
      sell: { min: '', max: '', marginalPrice: '', budget: '' },
    };
  }
  const marketPriceStr = marketPrice.toString();

  const fullRange = (() => {
    if (search.preset !== 'Infinity') return;
    return getFullRangesPrices(marketPriceStr, base.decimals, quote.decimals);
  })();

  const getMin = () => {
    if (fullRange) return fullRange.min;
    const preset = search.preset || defaultPreset;
    const multiplier = new SafeDecimal(1).minus(preset);
    return new SafeDecimal(marketPrice).times(multiplier).toString();
  };
  const getMax = () => {
    if (fullRange) return fullRange.max;
    const preset = search.preset || defaultPreset;
    const multiplier = new SafeDecimal(1).add(preset);
    return new SafeDecimal(marketPrice).times(multiplier).toString();
  };

  const {
    anchor,
    min = getMin(),
    max = getMax(),
    spread = defaultSpread,
    budget,
  } = search;

  if (!isValidRange(min, max) || !isValidSpread(min, max, spread)) {
    let marginalPrice = marketPriceStr;
    if (new SafeDecimal(marketPriceStr).gt(max)) marginalPrice = max;
    if (new SafeDecimal(marketPriceStr).lt(min)) marginalPrice = min;
    return {
      buy: { min: min, max: max, marginalPrice, budget: '' },
      sell: { min: min, max: max, marginalPrice, budget: '' },
    };
  }
  const prices = calculateOverlappingPrices(min, max, marketPriceStr, spread);
  const orders = {
    buy: {
      min: prices.buyPriceLow,
      max: prices.buyPriceHigh,
      marginalPrice: prices.buyPriceMarginal,
      budget: '',
    },
    sell: {
      min: prices.sellPriceLow,
      max: prices.sellPriceHigh,
      marginalPrice: prices.sellPriceMarginal,
      budget: '',
    },
  };
  if (!anchor || isZero(budget)) return orders;
  if (anchor === 'buy') {
    if (isMinAboveMarket(orders.buy)) return orders;
    orders.buy.budget = budget;
    orders.sell.budget = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPriceStr,
      spread,
      budget,
    );
  } else {
    if (isMaxBelowMarket(orders.sell)) return orders;
    orders.sell.budget = budget;
    orders.buy.budget = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPriceStr,
      spread,
      budget,
    );
  }
  return orders;
};
