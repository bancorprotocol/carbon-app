import { BigNumber } from 'bignumber.js';

export interface FullOutcomeParams {
  budget: string;
  min: string;
  max: string;
  price: string;
  buy?: boolean;
}

const isStringNumber = (value: string) => {
  if (typeof value !== 'string') return false;
  if (!value) return false;
  if (isNaN(Number(value))) return false;
  return true;
};

/**
 * Performe geometric mean on a range of positive values
 * @param min Should be lte max
 * @param max Should be gte min
 */
export const geoMean = (min: string, max: string) => {
  if (!isStringNumber(min) || !isStringNumber(max)) return;
  const lowRate = new BigNumber(min);
  const highRate = new BigNumber(max);
  if (lowRate.lte(0)) return;
  if (highRate.lte(0)) return;
  if (lowRate.gt(highRate)) return;
  return lowRate.multipliedBy(highRate).sqrt();
};

/** Get the aquired amount of token and mean price for a strategy */
export const getFullOutcome = ({
  budget,
  min,
  max,
  price,
  buy,
}: FullOutcomeParams) => {
  if (!isStringNumber(budget)) return;

  const _budget = new BigNumber(budget);
  if (_budget.lte(0)) return;

  const mean = price ? geoMean(price, price) : geoMean(min, max);
  if (!mean) return;

  const amount = buy
    ? new BigNumber(_budget).div(mean).toString()
    : new BigNumber(_budget).multipliedBy(mean).toString();
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
  const base = new BigNumber(balance || '0');
  const delta = new BigNumber(update || '0');
  if (type === 'deposit') return base.plus(delta).toString();
  return base.minus(delta).toString();
};
