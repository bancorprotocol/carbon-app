import { describe, test, expect } from 'vitest';
import { SafeDecimal } from 'libs/safedecimal';
import { deepCopy, getUndercutStrategy } from './utils';

type StrategyStatus = 'active' | 'noBudget' | 'paused' | 'inactive';

const baseStrategy = {
  type: 'static' as const,
  id: '',
  idDisplay: '',
  base: {
    address: '',
    decimals: 18,
    symbol: 'ETH',
  },
  quote: {
    address: '',
    decimals: 6,
    symbol: 'USDC',
  },
  buy: {
    budget: '',
    min: '',
    max: '',
    marginalPrice: '',
  },
  sell: {
    budget: '',
    min: '',
    max: '',
    marginalPrice: '',
  },
  status: 'active' as StrategyStatus,
  encoded: {
    id: '',
    token0: '',
    token1: '',
    order0: {
      y: '',
      z: '',
      A: '',
      B: '',
    },
    order1: {
      y: '',
      z: '',
      A: '',
      B: '',
    },
  },
  roi: new SafeDecimal('0'),
};

const undercutStrategy = deepCopy(baseStrategy);

describe('Test undercut strategy', () => {
  test('getUndercutStrategy with 0.1% rate', () => {
    const undercutDifference = 0.001;

    baseStrategy.buy.min = '0';
    baseStrategy.buy.max = '1700';
    baseStrategy.sell.min = '1800';
    baseStrategy.sell.max = '1900';
    undercutStrategy.buy.min = '0';
    undercutStrategy.buy.max = '1701.7';
    undercutStrategy.sell.min = '1798.2';
    undercutStrategy.sell.max = '1898.1';

    expect(getUndercutStrategy(baseStrategy, undercutDifference)).toStrictEqual(
      undercutStrategy,
    );
  });

  test('getUndercutStrategy with 0.1% rate and a strategy with one limit order', () => {
    const undercutDifference = 0.001;

    baseStrategy.buy.min = '0';
    baseStrategy.buy.max = '0';
    baseStrategy.sell.min = '1900';
    baseStrategy.sell.max = '1900';
    undercutStrategy.buy.min = '0';
    undercutStrategy.buy.max = '0';
    undercutStrategy.sell.min = '1898.1';
    undercutStrategy.sell.max = '1898.1';

    expect(getUndercutStrategy(baseStrategy, undercutDifference)).toStrictEqual(
      undercutStrategy,
    );
  });

  test('getUndercutStrategy with 1% rate', () => {
    const undercutDifference = 0.01;

    baseStrategy.buy.min = '1600';
    baseStrategy.buy.max = '1700';
    baseStrategy.sell.min = '1800';
    baseStrategy.sell.max = '1900';
    undercutStrategy.buy.min = '1616';
    undercutStrategy.buy.max = '1717';
    undercutStrategy.sell.min = '1782';
    undercutStrategy.sell.max = '1881';

    expect(getUndercutStrategy(baseStrategy, undercutDifference)).toStrictEqual(
      undercutStrategy,
    );
  });

  test('getUndercutStrategy with negative rate', () => {
    const undercutDifference = -1;

    baseStrategy.buy.min = '1600';
    baseStrategy.buy.max = '1700';
    baseStrategy.sell.min = '1800';
    baseStrategy.sell.max = '1900';
    undercutStrategy.buy.min = '1616';
    undercutStrategy.buy.max = '1717';
    undercutStrategy.sell.min = '1782';
    undercutStrategy.sell.max = '1881';

    expect(() =>
      getUndercutStrategy(baseStrategy, undercutDifference),
    ).toThrow();
  });

  test('getUndercutStrategy with rate higher than 100%', () => {
    const undercutDifference = 1.01;

    baseStrategy.buy.min = '1600';
    baseStrategy.buy.max = '1700';
    baseStrategy.sell.min = '1800';
    baseStrategy.sell.max = '1900';
    undercutStrategy.buy.min = '1616';
    undercutStrategy.buy.max = '1717';
    undercutStrategy.sell.min = '1782';
    undercutStrategy.sell.max = '1881';

    expect(() =>
      getUndercutStrategy(baseStrategy, undercutDifference),
    ).toThrow();
  });
});
