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
  budgetFiat?: string;
}
interface LimitOrder {
  price: string;
  budget: string;
}

export const STRATEGY_TYPES = [
  'Recurring',
  'Disposable',
  'Overlapping',
] as const;

export type StrategyType = (typeof STRATEGY_TYPES)[number];

export interface CreateStrategyTemplate {
  base: DebugTokens;
  quote: DebugTokens;
  buy: RangeOrder;
  sell: RangeOrder;
  amount?: string;
  spread?: string;
}

interface OverlappingParams {
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
  recurringLimitBuy: (
    pair: TokenPair,
    buy: LimitOrder
  ): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy: fromLimitOrder(buy),
    sell: emptyOrder(),
  }),
  recurringLimitSell: (
    pair: TokenPair,
    sell: LimitOrder
  ): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy: emptyOrder(),
    sell: fromLimitOrder(sell),
  }),
  recurringLimitBuySell: (
    pair: TokenPair,
    buy: LimitOrder,
    sell: LimitOrder
  ): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy: fromLimitOrder(buy),
    sell: fromLimitOrder(sell),
  }),
  recurringRangeBuy: (
    pair: TokenPair,
    buy: RangeOrder
  ): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy,
    sell: emptyOrder(),
  }),
  recurringRangeSell: (
    pair: TokenPair,
    sell: RangeOrder
  ): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy: emptyOrder(),
    sell,
  }),
  recurringRangeBuySell: (
    pair: TokenPair,
    buy: RangeOrder,
    sell: RangeOrder
  ): CreateStrategyTemplate => ({
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
