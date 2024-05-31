import { SafeDecimal } from 'libs/safedecimal';
import { sanitizeNumber } from 'utils/helpers';

export const getMaxSpread = (buyMin: number, sellMax: number) => {
  return (1 - (buyMin / sellMax) ** (1 / 2)) * 100;
};

export const getMinSellMax = (buyMin: number, spread: number) => {
  return buyMin / (1 - spread / 100) ** 2;
};

export const getMaxBuyMin = (sellMax: number, spread: number) => {
  return sellMax * (1 - spread / 100) ** 2;
};

type StrategyOrderInput =
  | { min: string; max: string }
  | { startRate: string; endRate: string };
interface StrategyInput {
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

export const isValidSpread = (spread: string | number) => {
  const _spread = new SafeDecimal(spread);
  return !_spread.isNaN() && _spread.gt(0) && _spread.lt(100);
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
  return Number(getSpread(strategy).toFixed(2));
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
  return new SafeDecimal(sellOrder.marginalPrice).eq(sellOrder.max);
};

interface BuyBudgetOrder extends BuyOrder {
  budget: string;
}
interface SellBudgetOrder extends SellOrder {
  budget: string;
}
/** Verify that both budget are above 1wei if they are enabled */
export function isOverlappingBudgetTooSmall(
  order0: BuyBudgetOrder,
  order1: SellBudgetOrder
) {
  if (isMaxBelowMarket(order1)) return false;
  if (isMinAboveMarket(order0)) return false;
  const buyBudget = Number(sanitizeNumber(order0.budget));
  const sellBudget = Number(sanitizeNumber(order1.budget));
  if (!!buyBudget && !!sellBudget) return false;
  if (!buyBudget && !sellBudget) return false;
  return true;
}
