import { Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';

export const getSpread = (min: number, max: number, spreadPPM: number) => {
  return ((max - min) * spreadPPM) / 100;
};

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

export const isOverlappingStrategy = (strategy: Strategy) => {
  const buyMax = new SafeDecimal(strategy.order0.endRate);
  const sellMin = new SafeDecimal(strategy.order1.startRate);
  if (sellMin.eq(0)) return false; // Limit strategy with only buy
  return buyMax.gt(sellMin);
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
