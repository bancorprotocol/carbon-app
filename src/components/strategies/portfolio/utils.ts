import { SafeDecimal } from 'libs/safedecimal';
import { Strategy } from 'libs/queries';
import { Token } from 'libs/tokens';
import { prettifyNumber } from 'utils/helpers';

export const buildPairNameByStrategy = ({ base, quote }: Strategy) => {
  return `${base.symbol}/${quote.symbol}`;
};

export const buildPercentageString = (percentage: SafeDecimal) => {
  if (percentage.isZero()) return '0.00%';
  if (percentage.isNaN()) return '0.00%';
  if (percentage.lt(0.01)) return '< 0.01%';
  return `${percentage.toFixed(2)}%`;
};

export const buildAmountString = (
  amount: SafeDecimal,
  { symbol }: Token,
  highPrecision: boolean = true
) => {
  return `${prettifyNumber(amount, { highPrecision })} ${symbol}`;
};
