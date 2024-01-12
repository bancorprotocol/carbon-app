import {
  DebugTokens,
  LimitOrder,
  TokenPair,
  CreateStrategyInput,
  RangeOrder,
  OverlappingParams,
} from './types';
import {
  getBuyMax,
  getSellMin,
} from '../../../src/components/strategies/overlapping/utils';
import { CreateStrategyTestCase } from './CreateStrategyDriver';

export const testDescription = (testCase: CreateStrategyTestCase) => {
  const input = testCase.input;
  if (input.type === 'overlapping') return 'Overlapping';
  if (input.type === 'disposable') {
    return `Disposable ${input.direction} ${input.setting}`;
  }
  return `Recurring ${input.setting.split('_').join(' ')}`;
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
