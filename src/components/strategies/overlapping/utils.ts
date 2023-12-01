import { Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';

export const getSpread = (min: number, max: number, spreadPPM: number) => {
  return ((max - min) * spreadPPM) / 100;
};

export const getBuyMax = (max: number, spreadPPM: number) => {
  return max / (1 + spreadPPM / 100);
};

export const getSellMin = (min: number, spreadPPM: number) => {
  return min * (1 + spreadPPM / 100);
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

export const isOverlappingStrategy = (strategy: Strategy) => {
  const { order0, order1 } = strategy;
  const buyStart = new SafeDecimal(order1.startRate);
  const buyEnd = new SafeDecimal(order1.endRate);
  const sellStart = new SafeDecimal(order0.startRate);
  const sellEnd = new SafeDecimal(order0.endRate);
  const deltaStart = sellStart.minus(buyStart);
  const deltaSEnd = sellEnd.minus(buyEnd);
  return deltaStart.minus(deltaSEnd).abs().lt(0.0001);
};

export const getSpreadPPM = (strategy: Strategy) => {
  const { order0, order1 } = strategy;
  const min = new SafeDecimal(order0.startRate);
  const buyMax = new SafeDecimal(order0.endRate);
  const max = new SafeDecimal(order1.endRate);
  const sellDelta = max.minus(buyMax);
  const totalDelta = max.minus(min);
  return sellDelta.div(totalDelta).times(100);
};

export const getRoundedSpreadPPM = (strategy: Strategy) => {
  const spreadPPRM = getSpreadPPM(strategy);
  return Number(spreadPPRM.toFixed(2));
};
