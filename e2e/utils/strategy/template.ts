import {
  getBuyMax,
  getSellMin,
} from '../../../src/components/strategies/overlapping/utils';

export const debugTokens = {
  BNB: '0x418D75f65a02b3D53B2418FB8E1fe493759c7605',
  BNT: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  SHIB: '0xfcaF0e4498E78d65526a507360F755178b804Ba8',
  UNI: '0x2730d6FdC86C95a74253BefFaA8306B40feDecbb',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
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

type DebugTokens = keyof typeof debugTokens;

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
  'recurring',
  'disposable',
  'overlapping',
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
