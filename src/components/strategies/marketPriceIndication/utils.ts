import type { SafeDecimal } from 'libs/safedecimal';

export const getMarketPricePercentage = (percent: SafeDecimal) => {
  const isAbove = percent.gt(0);
  if (percent.gte(99.99)) return '>99.99';
  if (percent.lte(-99.99)) return '99.99';
  if (percent.lte(0.01) && isAbove) return '<0.01';
  return isAbove ? percent.toFixed(2) : percent.times(-1).toFixed(2);
};

export const getSignedMarketPricePercentage = (percent: SafeDecimal) => {
  const isAbove = percent.gt(0);
  if (percent.gte(99.99)) return '>99.99';
  if (percent.lte(-99.99)) return '<-99.99';
  if (percent.lte(0.01) && isAbove) return '<0.01';
  if (percent.gte(-0.01) && !isAbove) return '>-0.01';
  return isAbove ? percent.toFixed(2) : percent.toFixed(2);
};
