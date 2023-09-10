import Decimal from 'decimal.js';

export const expandToken = (amount: string | number, precision: number) => {
  const trimmed = new Decimal(amount).toFixed(precision, 1);
  return new Decimal(trimmed)
    .times(new Decimal(10).pow(precision))
    .toFixed(0);
};

export const shrinkToken = (
  amount: string | number | Decimal,
  precision: number,
  chopZeros = false
) => {
  const bigNumAmount = new Decimal(amount);
  if (bigNumAmount.isZero()) return '0';
  const res = bigNumAmount
    .div(new Decimal(10).pow(precision))
    .toFixed(precision, Decimal.ROUND_DOWN);

  return chopZeros ? new Decimal(res).toString() : res;
};
