import { SafeDecimal } from 'libs/safedecimal';

export const expandToken = (amount: string | number, precision: number) => {
  const trimmed = new SafeDecimal(amount).toFixed(precision, 1);
  return new SafeDecimal(trimmed)
    .times(new SafeDecimal(10).pow(precision))
    .toFixed(0);
};

export const shrinkToken = (
  amount: string | number | SafeDecimal,
  precision: number,
  chopZeros = false
) => {
  const bigNumAmount = new SafeDecimal(amount);
  if (bigNumAmount.isZero()) return '0';
  const res = bigNumAmount
    .div(new SafeDecimal(10).pow(precision))
    .toFixed(precision, SafeDecimal.ROUND_DOWN);

  return chopZeros ? new SafeDecimal(res).toString() : res;
};
