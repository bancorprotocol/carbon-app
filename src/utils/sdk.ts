import { CreateStrategyParams } from 'queries';
import Decimal from 'decimal.js';
import BigNumber from 'bignumber.js';

Decimal.set({ precision: 155, rounding: Decimal.ROUND_DOWN });

const ONE = 2 ** 32;

const calcSqrt = (x: string | number | Decimal) => new Decimal(x).sqrt();

const calcScale = (x: string | number | Decimal) => calcSqrt(x).mul(ONE);

const calcA = (low: string, high: string) =>
  calcScale(high).minus(low).floor().toString();

const calcB = (low: string) => calcScale(low).floor().toString();

export const toStrategy = ({ token0, token1 }: CreateStrategyParams) => {
  const token0Balance = expandToken(token0.balance, token0.token.decimals);
  const token1Balance = expandToken(token1.balance, token1.token.decimals);
  const token0Low = expandToken(token0.low, token0.token.decimals);
  const token1Low = expandToken(token1.low, token1.token.decimals);
  const token0High = expandToken(token0.high, token0.token.decimals);
  const token1High = expandToken(token1.high, token1.token.decimals);

  return [
    token0.token.address,
    token1.token.address,
    token0Balance,
    token0Balance,
    calcA(token0Low, token0High),
    calcB(token0Low),
    token1Balance,
    token1Balance,
    calcA(token1Low, token1High),
    calcB(token1Low),
  ] as const;
};

export const expandToken = (amount: string | number, precision: number) => {
  const trimmed = new BigNumber(amount).toFixed(precision, 1);
  return new BigNumber(trimmed)
    .times(new BigNumber(10).pow(precision))
    .toFixed(0);
};

export const shrinkToken = (
  amount: string | number | BigNumber,
  precision: number,
  chopZeros = false
) => {
  const bigNumAmount = new BigNumber(amount);
  if (bigNumAmount.isEqualTo(0)) return '0';
  const res = bigNumAmount
    .div(new BigNumber(10).pow(precision))
    .toFixed(precision, BigNumber.ROUND_DOWN);

  return chopZeros ? new BigNumber(res).toString() : res;
};
