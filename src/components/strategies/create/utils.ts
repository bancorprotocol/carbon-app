import { Dispatch, SetStateAction } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';
import { NavigateOptions } from 'libs/routing';
import {
  StrategyDirection,
  StrategySettings,
  TradeOverlappingSearch,
  TradeRecurringSearch,
} from 'libs/routing/routes/trade';
import {
  checkIfOrdersOverlap,
  checkIfOrdersReversed,
  isValidRange,
} from '../utils';
import { Token } from 'libs/tokens';
import { isZero } from '../common/utils';
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
import { OrderBlock, OverlappingOrder } from '../common/types';

export const handleTxStatusAndRedirectToOverview = (
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  navigate?: (opts: NavigateOptions) => Promise<void>,
) => {
  setIsProcessing(true);
  setTimeout(() => {
    navigate?.({ to: '/portfolio', params: {}, search: {} });
    setIsProcessing(false);
  }, ONE_AND_A_HALF_SECONDS_IN_MS);
};

export const getRecurringPriceMultiplier = (
  direction: StrategyDirection,
  settings: StrategySettings,
) => {
  if (settings === 'range') {
    return {
      min: direction === 'buy' ? 0.95 : 1.01,
      max: direction === 'buy' ? 0.99 : 1.05,
    };
  } else {
    return {
      min: direction === 'buy' ? 0.99 : 1.01,
      max: direction === 'buy' ? 0.99 : 1.01,
    };
  }
};

export const getDefaultOrder = (
  direction: StrategyDirection,
  order: Partial<OrderBlock>,
  marketPrice: number | string = 0,
): OrderBlock => {
  const market = new SafeDecimal(marketPrice);
  const settings = order.settings ?? 'limit';
  const multiplier = getRecurringPriceMultiplier(direction, settings);
  if (settings === 'range') {
    return {
      min: order.min ?? market.mul(multiplier.min).toString(),
      max: order.max ?? market.mul(multiplier.max).toString(),
      budget: order.budget ?? '',
      settings,
    };
  } else {
    return {
      min: order.min ?? market.mul(multiplier.min).toString(),
      max: order.max ?? market.mul(multiplier.max).toString(),
      budget: order.budget ?? '',
      settings,
    };
  }
};

export const getRecurringError = (search: TradeRecurringSearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersReversed(buyOrder, sellOrder)) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

export const getRecurringWarning = (search: TradeRecurringSearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersOverlap(buyOrder, sellOrder)) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

export const overlappingMultiplier = {
  min: 0.99,
  max: 1.01,
};
const initMin = (marketPrice: string) => {
  const multiplier = overlappingMultiplier.min;
  return new SafeDecimal(marketPrice).times(multiplier).toString();
};
const initMax = (marketPrice: string) => {
  const multiplier = overlappingMultiplier.max;
  return new SafeDecimal(marketPrice).times(multiplier).toString();
};
/** Create the orders out of the search params */
export const getOverlappingOrders = (
  search: TradeOverlappingSearch,
  base?: Token,
  quote?: Token,
  marketPrice?: string,
): { buy: OverlappingOrder; sell: OverlappingOrder } => {
  if (!base || !quote || !marketPrice) {
    return {
      buy: { min: '', max: '', marginalPrice: '', budget: '' },
      sell: { min: '', max: '', marginalPrice: '', budget: '' },
    };
  }

  const {
    anchor,
    min = initMin(marketPrice),
    max = initMax(marketPrice),
    spread = defaultSpread,
    budget,
  } = search;

  if (!isValidRange(min, max) || !isValidSpread(min, max, spread)) {
    let marginalPrice = marketPrice;
    if (new SafeDecimal(marketPrice).gt(max)) marginalPrice = max;
    if (new SafeDecimal(marketPrice).lt(min)) marginalPrice = min;
    return {
      buy: { min: min, max: max, marginalPrice, budget: '' },
      sell: { min: min, max: max, marginalPrice, budget: '' },
    };
  }
  const prices = calculateOverlappingPrices(min, max, marketPrice, spread);
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
      marketPrice,
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
      marketPrice,
      spread,
      budget,
    );
  }
  return orders;
};
