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
}
interface LimitOrder {
  price: string;
  budget: string;
}
export interface CreateStrategyTemplate {
  base: DebugTokens;
  quote: DebugTokens;
  buy: RangeOrder;
  sell: RangeOrder;
  amount?: string;
  spread?: string;
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
  limitBuy: (pair: TokenPair, buy: LimitOrder): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy: fromLimitOrder(buy),
    sell: emptyOrder(),
  }),
  limitSell: (pair: TokenPair, sell: LimitOrder): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy: emptyOrder(),
    sell: fromLimitOrder(sell),
  }),
  limitBuySell: (
    pair: TokenPair,
    buy: LimitOrder,
    sell: LimitOrder
  ): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy: fromLimitOrder(buy),
    sell: fromLimitOrder(sell),
  }),
  rangeBuy: (pair: TokenPair, buy: RangeOrder): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy,
    sell: emptyOrder(),
  }),
  rangeSell: (pair: TokenPair, sell: RangeOrder): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy: emptyOrder(),
    sell,
  }),
  rangeBuySell: (
    pair: TokenPair,
    buy: RangeOrder,
    sell: RangeOrder
  ): CreateStrategyTemplate => ({
    ...fromPair(pair),
    buy,
    sell,
  }),
  overlapping: (pair: TokenPair, min: string, max: string, spread: string) => {
    return {
      ...fromPair(pair),
      buy: {
        min,
        max: getBuyMax(Number(max), Number(spread)).toString(),
        budget: '', // TODO: set budget
      },
      sell: {
        min: getSellMin(Number(min), Number(spread)).toString(),
        max,
        budget: '',
      },
      spread,
    };
  },
};
