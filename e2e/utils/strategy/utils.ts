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
} from './types';
import {
  getBuyMax,
  getSellMin,
} from '../../../src/components/strategies/overlapping/utils';

export function assertDisposableTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is DisposableStrategyTestCase {
  if (testCase.type !== 'disposable') {
    throw new Error('Test case should be disposable');
  }
}

export function assertRecurringTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is RecurringStrategyTestCase {
  if (testCase.type !== 'recurring') {
    throw new Error('Test case should be recurring');
  }
}

export function assertOverlappingTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is OverlappingStrategyTestCase {
  if (testCase.type !== 'overlapping') {
    throw new Error('Test case should be overlapping');
  }
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
  if (testCase.type === 'overlapping') return 'Overlapping';
  if (testCase.type === 'disposable') {
    return `Disposable ${testCase.direction} ${testCase.setting}`;
  }
  return `Recurring ${testCase.setting.split('_').join(' ')}`;
};

const emptyOrder = () => ({ min: '0', max: '0', budget: '0' });
const fromPair = (pair: TokenPair) => {
  const [base, quote] = pair.split('->') as [DebugTokens, DebugTokens];
  return { base, quote };
};
const fromLimitOrder = (order: LimitOrder): RangeOrder => ({
  min: order.price,
  max: order.price,
  budget: order.budget,
});
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
