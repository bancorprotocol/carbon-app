import { Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';

export const getBuyMax = (sellMax: number, spread: number) => {
  return sellMax / (1 + spread / 100);
};

export const getSellMin = (buyMin: number, spread: number) => {
  return buyMin * (1 + spread / 100);
};

export const getBuyMarginalPrice = (marketPrice: number, spread: number) => {
  return marketPrice / (1 + spread / 100) ** 0.5;
};

export const getSellMarginalPrice = (marketPrice: number, spread: number) => {
  return marketPrice * (1 + spread / 100) ** 0.5;
};

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
  const buyMax = new SafeDecimal(buyHigh);
  const sellMin = new SafeDecimal(sellLow);
  if (sellMin.eq(0)) return false; // Limit strategy with only buy
  if (buyMax.eq(0)) return false;
  return buyMax.gte(sellMin);
};

export const isValidSpread = (spread: number) => {
  return !isNaN(spread) && spread > 0 && spread < 100;
};

export const getSpread = (strategy: Strategy) => {
  const { order0, order1 } = strategy;
  const buyMax = Number(order0.endRate);
  const sellMax = Number(order1.endRate);
  return (sellMax / buyMax - 1) * 100;
};

export const getRoundedSpread = (strategy: Strategy) => {
  const spreadPPRM = getSpread(strategy);
  return Number(spreadPPRM.toFixed(2));
};

interface BuyOrder {
  min: string;
  marginalPrice: string;
}
export const isMinAboveMarket = (buyOrder: BuyOrder) => {
  return new SafeDecimal(buyOrder.min).minus(buyOrder.marginalPrice).gte(0);
};
interface SellOrder {
  max: string;
  marginalPrice: string;
}
export const isMaxBelowMarket = (sellOrder: SellOrder) => {
  return new SafeDecimal(sellOrder.marginalPrice).minus(sellOrder.max).gte(0);
};
