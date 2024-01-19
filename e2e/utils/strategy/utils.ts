import {
  DebugTokens,
  LimitOrder,
  TokenPair,
  CreateStrategyInput,
  RangeOrder,
  OverlappingParams,
  debugTokens,
  CreateStrategyTestCase,
  DisposableStrategyTestCase,
  RecurringStrategyTestCase,
  OverlappingStrategyTestCase,
  Setting,
  MinMax,
  StrategyCase,
} from './types';
import {
  getBuyMax,
  getSellMin,
} from '../../../src/components/strategies/overlapping/utils';

export function isDisposableTestCase(
  testCase: CreateStrategyTestCase
): testCase is DisposableStrategyTestCase {
  return testCase.type === 'disposable';
}

export function assertDisposableTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is DisposableStrategyTestCase {
  if (isDisposableTestCase(testCase)) return;
  throw new Error('Test case should be disposable');
}

export function isRecurringTestCase(
  testCase: CreateStrategyTestCase
): testCase is RecurringStrategyTestCase {
  return testCase.type === 'recurring';
}
export function assertRecurringTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is RecurringStrategyTestCase {
  if (isRecurringTestCase(testCase)) return;
  throw new Error('Test case should be recurring');
}

export function isOverlappingTestCase(
  testCase: CreateStrategyTestCase
): testCase is OverlappingStrategyTestCase {
  return testCase.type === 'overlapping';
}
export function assertOverlappingTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is OverlappingStrategyTestCase {
  if (isOverlappingTestCase(testCase)) return;
  throw new Error('Test case should be overlapping');
}

export const getRecurringSettings = (testCase: RecurringStrategyTestCase) => {
  return testCase.setting.split('_') as [Setting, Setting];
};

export function assertDebugToken(
  symbol: string
): asserts symbol is DebugTokens {
  const tokenList = Object.keys(debugTokens);
  if (!tokenList.includes(symbol)) {
    const msg = `Only use token from this list ${tokenList.join()}, got ${symbol}`;
    throw new Error(msg);
  }
}

export const testDescription = (testCase: CreateStrategyTestCase) => {
  if (isOverlappingTestCase(testCase)) return 'Overlapping';
  if (isDisposableTestCase(testCase)) {
    return `Disposable ${testCase.direction} ${testCase.setting}`;
  }
  return `Recurring ${testCase.setting.split('_').join(' ')}`;
};

export const screenshotPath = (
  testCase: CreateStrategyTestCase,
  strategyCase: StrategyCase,
  filename: string
) => {
  const description = testDescription(testCase);
  return `/strategy/${testCase.type}/${description}/${strategyCase}/${filename}`;
};

export const toDebugStrategy = (
  testCase: CreateStrategyTestCase
): CreateStrategyInput => {
  if (isRecurringTestCase(testCase)) return testCase.input.create;
  if (isOverlappingTestCase(testCase)) return testCase.input.create;
  // Disposable
  if (testCase.direction === 'buy') {
    return { buy: testCase.input.create, sell: emptyOrder() };
  } else {
    return { buy: emptyOrder(), sell: testCase.input.create };
  }
};

const emptyOrder = () => ({ min: '0', max: '0', budget: '0' });
export const fromPrice = (price: string): MinMax => ({
  min: price,
  max: price,
});
export const fromLimitOrder = (order: LimitOrder): RangeOrder => ({
  min: order.price,
  max: order.price,
  budget: order.budget,
});

// TODO: refactor the code below

const fromPair = (pair: TokenPair) => {
  const [base, quote] = pair.split('->') as [DebugTokens, DebugTokens];
  return { base, quote };
};
export const createDebugStrategy = {
  limitBuy: (pair: TokenPair, buy: LimitOrder): CreateStrategyInput => ({
    ...fromPair(pair),
    buy: fromLimitOrder(buy),
    sell: emptyOrder(),
  }),
  limitSell: (pair: TokenPair, sell: LimitOrder): CreateStrategyInput => ({
    ...fromPair(pair),
    buy: emptyOrder(),
    sell: fromLimitOrder(sell),
  }),
  limitBuySell: (
    pair: TokenPair,
    buy: LimitOrder,
    sell: LimitOrder
  ): CreateStrategyInput => ({
    ...fromPair(pair),
    buy: fromLimitOrder(buy),
    sell: fromLimitOrder(sell),
  }),
  rangeBuy: (pair: TokenPair, buy: RangeOrder): CreateStrategyInput => ({
    ...fromPair(pair),
    buy,
    sell: emptyOrder(),
  }),
  rangeSell: (pair: TokenPair, sell: RangeOrder): CreateStrategyInput => ({
    ...fromPair(pair),
    buy: emptyOrder(),
    sell,
  }),
  rangeBuySell: (
    pair: TokenPair,
    buy: RangeOrder,
    sell: RangeOrder
  ): CreateStrategyInput => ({
    ...fromPair(pair),
    buy,
    sell,
  }),
  overlapping: (params: OverlappingParams) => {
    const { pair, buyMin, sellMax, spread, buyBudget, sellBudget } = params;
    return {
      ...fromPair(pair),
      buy: {
        min: buyMin,
        max: getBuyMax(Number(sellMax), Number(spread)).toString(),
        budget: buyBudget,
      },
      sell: {
        min: getSellMin(Number(buyMin), Number(spread)).toString(),
        max: sellMax,
        budget: sellBudget,
      },
      spread,
    };
  },
};
