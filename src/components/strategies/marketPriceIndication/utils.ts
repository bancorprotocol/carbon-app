import type { SafeDecimal } from 'libs/safedecimal';

export const getMarketPricePercentage = (percent: SafeDecimal) => {
  if (percent.gte(99.99)) return '>+99.99';
  if (percent.lte(-99.99)) return '<-99.99';
  if (percent.lte(0.01) && percent.gt(0)) return '<+0.01';
  if (percent.gte(-0.01) && percent.lt(0)) return '>-0.01';
  if (percent.lt(0)) return percent.toFixed(2);
  return `+${percent.toFixed(2)}`;
};

export const getSignedMarketPricePercentage = (percent: SafeDecimal) => {
  const isAbove = percent.gt(0);
  if (percent.gte(99.99)) return '>99.99';
  if (percent.lte(-99.99)) return '<-99.99';
  if (percent.lte(0.01) && isAbove) return '<0.01';
  if (percent.gte(-0.01) && !isAbove) return '>-0.01';
  return isAbove ? percent.toFixed(2) : percent.toFixed(2);
};
