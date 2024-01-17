import type { Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';

export const getUndercutStrategy = (
  strategy: Strategy,
  undercutDifference: number
): Strategy => {
  const multiplyRate = (rate: string, factor: number) =>
    new SafeDecimal(rate).times(factor).toString();

  const undercutStrategy = {
    ...strategy,
    order0: {
      ...strategy.order0,
      startRate: multiplyRate(
        strategy.order0.startRate,
        1 + undercutDifference
      ),
      endRate: multiplyRate(strategy.order0.endRate, 1 + undercutDifference),
    },
    order1: {
      ...strategy.order1,
      startRate: multiplyRate(
        strategy.order1.startRate,
        1 - undercutDifference
      ),
      endRate: multiplyRate(strategy.order1.endRate, 1 - undercutDifference),
    },
  };

  return undercutStrategy;
};
