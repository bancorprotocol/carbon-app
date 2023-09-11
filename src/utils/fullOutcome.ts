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
  if (lowRate.lte(0)) return;
  if (highRate.lte(0)) return;
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

/** Update existing balance with the update from user input */
export const getUpdatedBudget = (
  type: 'deposit' | 'withdraw',
  balance?: string,
  update?: string
) => {
  const base = new Decimal(balance || '0');
  const delta = new Decimal(update || '0');
  if (type === 'deposit') return base.add(delta).toString();
  return base.sub(delta).toString();
};
