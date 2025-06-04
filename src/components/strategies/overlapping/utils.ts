import { SafeDecimal } from 'libs/safedecimal';
import {
  StrategyInput,
  isOverlappingStrategy,
  isPaused,
  isZero,
} from 'components/strategies/common/utils';
import { type Strategy } from 'libs/queries';
import { geoMean } from 'utils/fullOutcome';

export interface OverlappingSearch {
  marketPrice?: string;
  min?: string;
  max?: string;
  spread?: string;
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

export const getSpread = ({ order0, order1 }: StrategyInput) => {
  const buyHigh = 'endRate' in order0 ? order0.endRate : order0.max;
  const sellHigh = 'endRate' in order1 ? order1.endRate : order1.max;
  if (!Number(buyHigh) || !Number(sellHigh)) return new SafeDecimal(0);
  const buyMax = new SafeDecimal(buyHigh);
  const sellMax = new SafeDecimal(sellHigh);
  return sellMax.div(buyMax).minus(1).times(100);
};

export const getRoundedSpread = (strategy: StrategyInput) => {
  return Number(getSpread(strategy).toFixed(6));
};

type BuyOrder =
  | { min: string; marginalPrice: string }
  | { startRate: string; marginalRate: string };
export const isMinAboveMarket = (buyOrder: BuyOrder) => {
  if ('min' in buyOrder) {
    return new SafeDecimal(buyOrder.min).eq(buyOrder.marginalPrice);
  } else {
    return new SafeDecimal(buyOrder.startRate).eq(buyOrder.marginalRate);
  }
};
type SellOrder =
  | { max: string; marginalPrice: string }
  | { endRate: string; marginalRate: string };
export const isMaxBelowMarket = (sellOrder: SellOrder) => {
  if ('max' in sellOrder) {
    return new SafeDecimal(sellOrder.max).eq(sellOrder.marginalPrice);
  } else {
    return new SafeDecimal(sellOrder.endRate).eq(sellOrder.marginalRate);
  }
};

export const hasNoBudget = (strategy: Strategy) => {
  const { order0, order1 } = strategy;
  return !Number(order0.balance) && !Number(order1.balance);
};

export const getCalculatedPrice = (strategy: Strategy) => {
  const { order0, order1 } = strategy;
  if (hasNoBudget(strategy)) return;
  if (!isOverlappingStrategy(strategy)) return;
  if (isZero(strategy.order0.marginalRate)) return;
  if (isZero(strategy.order1.marginalRate)) return;
  if (isMinAboveMarket(strategy.order0)) return strategy.order0.marginalRate;
  if (isMaxBelowMarket(strategy.order1)) return strategy.order1.marginalRate;
  return geoMean(order0.marginalRate, order1.marginalRate)?.toString();
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
  const { order0, order1 } = strategy;
  const { min, max, spread, marketPrice } = search;
  if (marketPrice) return true;
  if (!isOverlappingStrategy(strategy)) return true;
  if (hasNoBudget(strategy)) return true;
  if (isPaused(strategy)) return true;
  if (min && min !== order0.startRate) return true;
  if (max && max !== order1.endRate) return true;
  if (spread && spread !== getRoundedSpread(strategy).toString()) return true;
  return false;
};
