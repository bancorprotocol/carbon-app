import { isOverlappingStrategy } from 'components/strategies/common/utils';
import type { Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';

const replaceDecimal = (key: string, value: any) => {
  if (value instanceof SafeDecimal)
    return { __type__: 'SafeDecimal', value: value.toString() };
  return value;
};
const reviveDecimal = (key: string, value: any) => {
  if (
    typeof value === 'object' &&
    value !== null &&
    value['__type__'] === 'SafeDecimal'
  )
    return new SafeDecimal(value.value);
  return value;
};

export const deepCopy = (obj: any): any =>
  JSON.parse(JSON.stringify(obj, replaceDecimal), reviveDecimal);

export const getUndercutStrategy = (
  strategy: Strategy,
  undercutDifference: number,
): Strategy => {
  const multiplyByRate = (rate: string, factor: number) =>
    new SafeDecimal(rate).times(factor).toString();

  if (undercutDifference < 0 || undercutDifference > 1)
    throw new Error(
      'undercutDifference must be less than or equal to 1, and higher than or equal to 0',
    );

  const undercutStrategy = deepCopy(strategy);

  undercutStrategy.order0.startRate = multiplyByRate(
    strategy.order0.startRate,
    1 + undercutDifference,
  );
  undercutStrategy.order0.endRate = multiplyByRate(
    strategy.order0.endRate,
    1 + undercutDifference,
  );
  undercutStrategy.order1.startRate = multiplyByRate(
    strategy.order1.startRate,
    1 - undercutDifference,
  );
  undercutStrategy.order1.endRate = multiplyByRate(
    strategy.order1.endRate,
    1 - undercutDifference,
  );

  // If buy & sell orders are inverted, return existing strategy
  if (isOverlappingStrategy(undercutStrategy)) return strategy;

  return undercutStrategy;
};
