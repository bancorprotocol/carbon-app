import { describe, test, expect } from 'vitest';
import { SafeDecimal } from 'libs/safedecimal';
import { deepCopy, getUndercutStrategy } from './utils';

type StrategyStatus = 'active' | 'noBudget' | 'paused' | 'inactive';

const baseStrategy = {
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
  order0: {
    balance: '',
    startRate: '',
    endRate: '',
    marginalRate: '',
  },
  order1: {
    balance: '',
    startRate: '',
    endRate: '',
    marginalRate: '',
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

    baseStrategy.order0.startRate = '0';
    baseStrategy.order0.endRate = '1700';
    baseStrategy.order1.startRate = '1800';
    baseStrategy.order1.endRate = '1900';
    undercutStrategy.order0.startRate = '0';
    undercutStrategy.order0.endRate = '1701.7';
    undercutStrategy.order1.startRate = '1798.2';
    undercutStrategy.order1.endRate = '1898.1';

    expect(getUndercutStrategy(baseStrategy, undercutDifference)).toStrictEqual(
      undercutStrategy,
    );
  });

  test('getUndercutStrategy with 0.1% rate and a strategy with one limit order', () => {
    const undercutDifference = 0.001;

    baseStrategy.order0.startRate = '0';
    baseStrategy.order0.endRate = '0';
    baseStrategy.order1.startRate = '1900';
    baseStrategy.order1.endRate = '1900';
    undercutStrategy.order0.startRate = '0';
    undercutStrategy.order0.endRate = '0';
    undercutStrategy.order1.startRate = '1898.1';
    undercutStrategy.order1.endRate = '1898.1';

    expect(getUndercutStrategy(baseStrategy, undercutDifference)).toStrictEqual(
      undercutStrategy,
    );
  });

  test('getUndercutStrategy with 1% rate', () => {
    const undercutDifference = 0.01;

    baseStrategy.order0.startRate = '1600';
    baseStrategy.order0.endRate = '1700';
    baseStrategy.order1.startRate = '1800';
    baseStrategy.order1.endRate = '1900';
    undercutStrategy.order0.startRate = '1616';
    undercutStrategy.order0.endRate = '1717';
    undercutStrategy.order1.startRate = '1782';
    undercutStrategy.order1.endRate = '1881';

    expect(getUndercutStrategy(baseStrategy, undercutDifference)).toStrictEqual(
      undercutStrategy,
    );
  });

  test('getUndercutStrategy with negative rate', () => {
    const undercutDifference = -1;

    baseStrategy.order0.startRate = '1600';
    baseStrategy.order0.endRate = '1700';
    baseStrategy.order1.startRate = '1800';
    baseStrategy.order1.endRate = '1900';
    undercutStrategy.order0.startRate = '1616';
    undercutStrategy.order0.endRate = '1717';
    undercutStrategy.order1.startRate = '1782';
    undercutStrategy.order1.endRate = '1881';

    expect(() =>
      getUndercutStrategy(baseStrategy, undercutDifference),
    ).toThrow();
  });

  test('getUndercutStrategy with rate higher than 100%', () => {
    const undercutDifference = 1.01;

    baseStrategy.order0.startRate = '1600';
    baseStrategy.order0.endRate = '1700';
    baseStrategy.order1.startRate = '1800';
    baseStrategy.order1.endRate = '1900';
    undercutStrategy.order0.startRate = '1616';
    undercutStrategy.order0.endRate = '1717';
    undercutStrategy.order1.startRate = '1782';
    undercutStrategy.order1.endRate = '1881';

    expect(() =>
      getUndercutStrategy(baseStrategy, undercutDifference),
    ).toThrow();
  });
});
