import {
  DebugTokens,
  TokenPair,
  Setting,
  RangeOrder,
  MinMax,
  Direction,
} from '../types';

const STRATEGY_TYPES = ['recurring', 'disposable', 'overlapping'] as const;

export type StrategyType = (typeof STRATEGY_TYPES)[number];

export interface CreateStrategyInput {
  buy: RangeOrder;
  sell: RangeOrder;
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

///////////////
// RECURRING //
///////////////

export interface RecurringStrategyTestCase {
  type: 'recurring';
  setting: `${Setting}_${Setting}`;
  base: DebugTokens;
  quote: DebugTokens;
  input: {
    create: CreateStrategyInput;
    editPrice: {
      buy: MinMax;
      sell: MinMax;
    };
    withdraw: {
      buy: string;
      sell: string;
    };
    deposit: {
      buy: string;
      sell: string;
    };
  };
  output: {
    create: {
      totalFiat: string;
      buy: OrderOutput;
      sell: OrderOutput;
    };
    editPrice: {
      buy: MinMax;
      sell: MinMax;
    };
    withdraw: {
      buy: string;
      sell: string;
    };
    deposit: {
      buy: string;
      sell: string;
    };
    undercut: {
      totalFiat: string;
      buy: {
        min: string;
        max: string;
        budget: string;
        fiat: string;
      };
      sell: {
        min: string;
        max: string;
        budget: string;
        fiat: string;
      };
    };
  };
}

/////////////////
// OVERLAPPING //
/////////////////

export interface CreateOverlappingStrategyInput extends CreateStrategyInput {
  spread: string;
}
export interface OverlappingStrategyTestCase {
  type: 'overlapping';
  base: DebugTokens;
  quote: DebugTokens;
  input: {
    create: CreateOverlappingStrategyInput;
  };
  output: {
    create: {
      totalFiat: string;
      buy: Omit<OrderOutput, 'outcomeValue' | 'outcomeQuote'>;
      sell: Omit<OrderOutput, 'outcomeValue' | 'outcomeQuote'>;
    };
  };
}

////////////////
// DISPOSABLE //
////////////////

export interface DisposableStrategyOutput {
  create: {
    buy: OrderOutput;
    sell: OrderOutput;
  };
}
export interface DisposableStrategyTestCase {
  type: 'disposable';
  setting: Setting;
  direction: Direction;
  base: DebugTokens;
  quote: DebugTokens;
  input: {
    create: RangeOrder;
    editPrice: MinMax;
    deposit: string;
    withdraw: string;
  };
  output: {
    create: OrderOutput;
    editPrice: MinMax;
    deposit: string;
    withdraw: string;
  };
}

export type CreateStrategyTestCase =
  | DisposableStrategyTestCase
  | RecurringStrategyTestCase
  | OverlappingStrategyTestCase;

/** Use to create a generic strategy in the debug page */
export interface DebugStrategy extends CreateStrategyInput {
  spread?: string;
}
