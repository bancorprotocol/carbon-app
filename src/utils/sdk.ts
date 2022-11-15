import { CreateStrategyParams } from 'queries';
import Decimal from 'decimal.js';

Decimal.set({ precision: 155, rounding: Decimal.ROUND_DOWN });

const ONE = 2 ** 32;

const calcSqrt = (x: string | number | Decimal) => new Decimal(x).sqrt();

const calcScale = (x: string | number | Decimal) => calcSqrt(x).mul(ONE);

const calcA = (low: string, high: string) =>
  calcScale(high).minus(low).floor().toString();

const calcB = (low: string) => calcScale(low).floor().toString();

export const toStrategy = ({ source, target }: CreateStrategyParams) => {
  const res = [
    source.token?.address || '',
    target.token?.address || '',
    source.liquidity,
    source.liquidity,
    calcA(source.low, source.high),
    calcB(source.low),
    target.liquidity,
    target.liquidity,
    calcA(target.low, target.high),
    calcB(target.low),
  ] as const;
  console.log(res);
  return res;
};
