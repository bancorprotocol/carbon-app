import {
  getBuyMax,
  getSellMin,
} from '../../../src/components/strategies/overlapping/utils';

type DebugTokens =
  | 'USDC'
  | 'DAI'
  | 'BNT'
  | 'PARQ'
  | 'WBTC'
  | 'BNB'
  | 'MATIC'
  | 'SHIB'
  | 'UNI'
  | 'USDT'
  | 'ETH';

interface RangeOrder {
  min: string;
  max: string;
  budget: string;
  // TODO: remove this
  budgetFiat?: string;
}
interface LimitOrder {
  price: string;
  budget: string;
}

export const STRATEGY_TYPES = [
  'recurring',
  'disposable',
  'overlapping',
] as const;

export type StrategyType = (typeof STRATEGY_TYPES)[number];

export interface CreateStrategyInput {
  base: DebugTokens;
  quote: DebugTokens;
  buy: RangeOrder;
  sell: RangeOrder;
  amount?: string;
  spread?: string;
}

export interface OverlappingParams {
  pair: TokenPair;
  buyMin: string;
  buyBudget: string;
  sellMax: string;
  sellBudget: string;
  spread: string;
}

type TokenPair = `${DebugTokens}->${DebugTokens}`;
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
