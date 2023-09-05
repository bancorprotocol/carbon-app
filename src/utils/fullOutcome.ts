import Decimal from 'decimal.js';

export interface AcquireAmountProps {
  budget: string;
  min: string;
  max: string;
  price: string;
  buy?: boolean;
}

export const geoMean = (min: string, max: string) => {
  const lowRate = new Decimal(min);
  const highRate = new Decimal(max);
  if (lowRate.gt(highRate)) return;
  return lowRate.mul(highRate).pow(0.5);
};

export const getAcquiredAmount = ({
  budget,
  min,
  max,
  price,
  buy,
}: AcquireAmountProps) => {
  if (!budget) return;
  if (!price && (!min || !max)) return;
  const mean = price ? geoMean(price, price) : geoMean(min, max);
  if (!mean) return;

  const amount = buy
    ? new Decimal(budget).div(mean).toString()
    : new Decimal(budget).mul(mean).toString();
  return {
    mean: mean.toString(),
    amount: amount.toString(),
  };
};