import { SafeDecimal } from 'libs/safedecimal';
import {
  StrategyInput,
  isOverlappingStrategy,
  isPaused,
  isZero,
} from 'components/strategies/common/utils';
import { geoMean } from 'utils/fullOutcome';
import { Strategy } from '../common/types';

export interface OverlappingSearch {
  marketPrice?: string;
  min?: string;
  max?: string;
  spread?: string;
  fullRange?: boolean;
}

export const defaultSpread = '0.05';

export const getMaxSpread = (buyMin: number, sellMax: number) => {
  return (1 - (buyMin / sellMax) ** (1 / 2)) * 100;
};

export const getMinSellMax = (buyMin: number, spread: number) => {
  return buyMin / (1 - spread / 100) ** 2;
};

export const getMaxBuyMin = (sellMax: number, spread: number) => {
  return sellMax * (1 - spread / 100) ** 2;
};

export const isValidSpread = (
  min: string,
  max: string,
  spread?: string | number,
) => {
  if (!spread) return false;
  const _spread = new SafeDecimal(spread);
  const maxSpread = getMaxSpread(+min, +max);
  return !_spread.isNaN() && _spread.gt(0) && _spread.lte(maxSpread);
};

export const getSpread = ({ buy, sell }: StrategyInput) => {
  const buyHigh = buy.max;
  const sellHigh = sell.max;
  if (!Number(buyHigh) || !Number(sellHigh)) return new SafeDecimal(0);
  const buyMax = new SafeDecimal(buyHigh);
  const sellMax = new SafeDecimal(sellHigh);
  return sellMax.div(buyMax).minus(1).times(100);
};

export const getRoundedSpread = (strategy: StrategyInput) => {
  return Number(getSpread(strategy).toFixed(6));
};

interface BuyOrder {
  min: string;
  marginalPrice: string;
}
export const isMinAboveMarket = (buyOrder: BuyOrder) => {
  return new SafeDecimal(buyOrder.min).eq(buyOrder.marginalPrice);
};
interface SellOrder {
  max: string;
  marginalPrice: string;
}
export const isMaxBelowMarket = (sellOrder: SellOrder) => {
  return new SafeDecimal(sellOrder.max).eq(sellOrder.marginalPrice);
};

export const hasNoBudget = (strategy: Strategy) => {
  const { buy, sell } = strategy;
  return !Number(buy.budget) && !Number(sell.budget);
};

export const getCalculatedPrice = (strategy: Strategy) => {
  const { buy, sell } = strategy;
  if (hasNoBudget(strategy)) return;
  if (!isOverlappingStrategy(strategy)) return;
  if (isZero(strategy.buy.marginalPrice)) return;
  if (isZero(strategy.sell.marginalPrice)) return;
  if (isMinAboveMarket(strategy.buy)) return strategy.buy.marginalPrice;
  if (isMaxBelowMarket(strategy.sell)) return strategy.sell.marginalPrice;
  return geoMean(buy.marginalPrice, sell.marginalPrice)?.toString();
};

export const getOverlappingMarketPrice = (
  strategy: Strategy,
  search: OverlappingSearch,
  externalPrice?: string,
) => {
  const calculatedPrice = getCalculatedPrice(strategy);
  const touched = isOverlappingTouched(strategy, search);
  if (touched) {
    return search.marketPrice ?? externalPrice ?? calculatedPrice;
  } else {
    return search.marketPrice ?? calculatedPrice ?? externalPrice;
  }
};

export function hasArbOpportunity(
  buyMarginal: string,
  spread: string,
  marketPrice?: string,
) {
  if (!marketPrice) return false;
  const spreadPPM = new SafeDecimal(spread).div(100);
  const calculatedPrice = spreadPPM.add(1).sqrt().times(buyMarginal);
  return !calculatedPrice.eq(marketPrice);
}

export const isOverlappingTouched = (
  strategy: Strategy,
  search: OverlappingSearch,
) => {
  const { buy, sell } = strategy;
  const { min, max, spread, marketPrice, fullRange } = search;
  if (marketPrice) return true;
  if (typeof fullRange === 'boolean') return true;
  if (!isOverlappingStrategy(strategy)) return true;
  if (hasNoBudget(strategy)) return true;
  if (isPaused(strategy)) return true;
  if (min && min !== buy.min) return true;
  if (max && max !== sell.max) return true;
  if (spread && spread !== getRoundedSpread(strategy).toString()) return true;
  return false;
};
