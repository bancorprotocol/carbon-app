import Decimal from 'decimal.js';

export interface FullOutcomeParams {
  budget: string;
  min: string;
  max: string;
  price: string;
  buy?: boolean;
}

/**
 * Performe geometric mean on a range of positive values
 * @param min Should be lte max
 * @param max Should be gte min
 */
export const geoMean = (min: string, max: string) => {
  const lowRate = new Decimal(min);
  const highRate = new Decimal(max);
  if (lowRate.lt(0)) return;
  if (highRate.lt(0)) return;
  if (lowRate.gt(highRate)) return;
  return lowRate.mul(highRate).pow(0.5);
};

/** Get the aquired amount of token and mean price for a strategy */
export const getFullOutcome = ({
  budget,
  min,
  max,
  price,
  buy,
}: FullOutcomeParams) => {
  if (!budget) return;
  if (!price && (!min || !max)) return;

  const _budget = new Decimal(budget);
  if (_budget.lte(0)) return;

  const mean = price ? geoMean(price, price) : geoMean(min, max);
  if (!mean) return;

  const amount = buy
    ? new Decimal(_budget).div(mean).toString()
    : new Decimal(_budget).mul(mean).toString();
  return {
    mean: mean.toString(),
    amount: amount.toString(),
  };
};
