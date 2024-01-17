import { TestCase } from '../types';

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

export type DebugTokens = keyof typeof debugTokens;

export interface RangeOrder {
  min: string;
  max: string;
  budget: string;
}
export interface LimitOrder {
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

export type TokenPair = `${DebugTokens}->${DebugTokens}`;

export type Setting = 'limit' | 'range';
export type Direction = 'buy' | 'sell';
export type StrategySettings =
  | `two-${Setting}s`
  | `${Direction}-${Setting}`
  | 'overlapping';

interface OrderOutput {
  min: string;
  max: string;
  outcomeValue: string;
  outcomeQuote: string;
  budget: string;
  fiat: string;
}

export interface RecurringStrategyInput extends CreateStrategyInput {
  type: 'recurring';
  setting: `${Setting}_${Setting}`;
}
export interface RecurringStrategyOutput {
  create: {
    totalFiat: string;
    buy: OrderOutput;
    sell: OrderOutput;
  };
}
export type RecurringStrategyTestCase = TestCase<
  RecurringStrategyInput,
  RecurringStrategyOutput
>;

export interface OverlappingStrategyInput extends CreateStrategyInput {
  type: 'overlapping';
  spread: string;
}
export interface OverlappingStrategyOutput {
  create: {
    totalFiat: string;
    buy: Omit<OrderOutput, 'outcomeValue' | 'outcomeQuote'>;
    sell: Omit<OrderOutput, 'outcomeValue' | 'outcomeQuote'>;
  };
}
export type OverlappingStrategyTestCase = TestCase<
  OverlappingStrategyInput,
  OverlappingStrategyOutput
>;

export interface DisposableStrategyInput extends CreateStrategyInput {
  type: 'disposable';
  setting: Setting;
  direction: Direction;
}
export interface DisposableStrategyOutput {
  create: {
    buy: OrderOutput;
    sell: OrderOutput;
  };
}
export type DisposableStrategyTestCase = TestCase<
  DisposableStrategyInput,
  DisposableStrategyOutput
>;

export type CreateStrategyTestCase =
  | DisposableStrategyTestCase
  | RecurringStrategyTestCase
  | OverlappingStrategyTestCase;
