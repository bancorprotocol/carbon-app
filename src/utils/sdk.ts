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

export const toStrategy = ({ source, target }: CreateStrategyParams) => {
  const sourceLiquidity = expandToken(source.liquidity, source.token.decimals);
  const targetLiquidity = expandToken(target.liquidity, target.token.decimals);
  const sourceLow = expandToken(source.low, source.token.decimals);
  const targetLow = expandToken(target.low, target.token.decimals);
  const sourceHigh = expandToken(source.high, source.token.decimals);
  const targetHigh = expandToken(target.high, target.token.decimals);

  return [
    source.token.address,
    target.token.address,
    sourceLiquidity,
    sourceLiquidity,
    calcA(sourceLow, sourceHigh),
    calcB(sourceLow),
    targetLiquidity,
    targetLiquidity,
    calcA(targetLow, targetHigh),
    calcB(targetLow),
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
