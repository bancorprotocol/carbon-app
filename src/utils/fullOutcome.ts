import { SafeDecimal } from '../libs/safedecimal';

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
  const lowRate = new SafeDecimal(min);
  const highRate = new SafeDecimal(max);
  if (lowRate.lte(0)) return;
  if (highRate.lte(0)) return;
  if (lowRate.gt(highRate)) return;
  return lowRate.times(highRate).sqrt();
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

  const _budget = new SafeDecimal(budget);
  if (_budget.lte(0)) return;

  const mean = price ? geoMean(price, price) : geoMean(min, max);
  if (!mean) return;

  const amount = buy
    ? new SafeDecimal(_budget).div(mean).toString()
    : new SafeDecimal(_budget).times(mean).toString();
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
  const base = new SafeDecimal(balance || '0');
  const delta = new SafeDecimal(update || '0');
  if (type === 'deposit') return base.plus(delta).toString();
  return base.minus(delta).toString();
};
