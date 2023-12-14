import { Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';

export const getBuyMax = (sellMax: number, spreadPPM: number) => {
  return sellMax / (1 + spreadPPM / 100);
};

export const getSellMin = (buyMin: number, spreadPPM: number) => {
  return buyMin * (1 + spreadPPM / 100);
};

export const getBuyMarginalPrice = (marketPrice: number, spreadPPM: number) => {
  return marketPrice / (1 + spreadPPM / 100) ** 0.5;
};

export const getSellMarginalPrice = (
  marketPrice: number,
  spreadPPM: number
) => {
  return marketPrice * (1 + spreadPPM / 100) ** 0.5;
};

export const getMaxSpreadPPM = (buyMin: number, sellMax: number) => {
  return (1 - (buyMin / sellMax) ** (1 / 2)) * 100;
};

export const getMinSellMax = (buyMin: number, spreadPPM: number) => {
  return buyMin / (1 - spreadPPM / 100) ** 2;
};

export const getMaxBuyMin = (sellMax: number, spreadPPM: number) => {
  return sellMax * (1 - spreadPPM / 100) ** 2;
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

export const getSpreadPPM = (strategy: Strategy) => {
  const { order0, order1 } = strategy;
  const buyMax = Number(order0.endRate);
  const sellMax = Number(order1.endRate);
  return (sellMax / buyMax - 1) * 100;
};

export const getRoundedSpreadPPM = (strategy: Strategy) => {
  const spreadPPRM = getSpreadPPM(strategy);
  return Number(spreadPPRM.toFixed(2));
};

interface BuyOrder {
  min: string;
  marginalPrice: string;
}
export const isMinAboveMarket = (buyOrder: BuyOrder, quote?: Token) => {
  const wei = new SafeDecimal(10).pow((quote?.decimals ?? 0) * -1);
  return new SafeDecimal(buyOrder.min)
    .minus(buyOrder.marginalPrice)
    .abs()
    .lt(wei);
};
interface SellOrder {
  max: string;
  marginalPrice: string;
}
export const isMaxBelowMarket = (sellOrder: SellOrder, quote?: Token) => {
  const wei = new SafeDecimal(10).pow((quote?.decimals ?? 0) * -1);
  return new SafeDecimal(sellOrder.max)
    .minus(sellOrder.marginalPrice)
    .abs()
    .lt(wei);
};
