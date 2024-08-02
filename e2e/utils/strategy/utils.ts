import {
  CreateStrategyInput,
  CreateStrategyTestCase,
  DisposableStrategyTestCase,
  RecurringStrategyTestCase,
  OverlappingStrategyTestCase,
} from './types';
import {
  DebugTokens,
  LimitOrder,
  RangeOrder,
  debugTokens,
  Setting,
  MinMax,
  StrategyCase,
} from '../types';

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
    return `Disposable_${testCase.direction}_${testCase.setting}`;
  }
  return `Recurring_${testCase.setting}`;
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
  if (isOverlappingTestCase(testCase)) return testCase.input.baseStrategy;
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
