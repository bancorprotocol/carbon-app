import {
  DebugTokens,
  TokenPair,
  Setting,
  RangeOrder,
  MinMax,
  Direction,
} from '../types';

export type StrategyType =
  | 'market'
  | 'recurring'
  | 'disposable'
  | 'overlapping';

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
    editPrices: {
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
    editPrices: {
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
export interface EditPriceOverlappingStrategyInput {
  min: string;
  max: string;
  spread: string;
  anchor: 'buy' | 'sell';
  action: 'deposit' | 'withdraw';
  budget: string;
}

interface OverlappingOrderOutput {
  min: string;
  max: string;
  spread: string;
  marginal: string;
  budget: string;
  fiat: string;
}
interface OverlappingOutput {
  totalFiat: string;
  buy: OverlappingOrderOutput;
  sell: OverlappingOrderOutput;
}
export interface OverlappingStrategyTestCase {
  type: 'overlapping';
  base: DebugTokens;
  quote: DebugTokens;
  input: {
    baseStrategy: CreateStrategyInput;
    create: CreateOverlappingStrategyInput;
    editPrices: EditPriceOverlappingStrategyInput;
    withdraw: { anchor: 'buy' | 'sell'; budget: string };
    deposit: { anchor: 'buy' | 'sell'; budget: string };
  };
  output: {
    create: OverlappingOutput;
    editPrices: OverlappingOutput;
    undercut: OverlappingOutput;
    withdraw: { buy: string; sell: string };
    deposit: { buy: string; sell: string };
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
    editPrices: MinMax;
    deposit: string;
    withdraw: string;
  };
  output: {
    create: OrderOutput;
    undercut: MinMax;
    editPrices: MinMax;
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
