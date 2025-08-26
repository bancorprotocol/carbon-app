import { SafeDecimal } from 'libs/safedecimal';
import { AnyBaseStrategy } from 'components/strategies/common/types';
import { Token } from 'libs/tokens';
import { tokenAmount } from 'utils/helpers';

export const buildPairNameByStrategy = ({ base, quote }: AnyBaseStrategy) => {
  return `${base.symbol}/${quote.symbol}`;
};

export const buildPercentageString = (percentage: SafeDecimal) => {
  if (percentage.isZero()) return '0.00%';
  if (percentage.isNaN()) return '0.00%';
  if (percentage.lt(0.01)) return '< 0.01%';
  return `${percentage.toFixed(2)}%`;
};

export const buildAmountString = (amount: SafeDecimal, token?: Token) => {
  if (!token) return '';
  return tokenAmount(amount, token);
};
