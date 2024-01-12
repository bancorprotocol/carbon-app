export type DebugTokens =
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
