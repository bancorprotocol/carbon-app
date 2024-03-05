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

export type StrategyCase =
  | 'create'
  | 'withdraw'
  | 'delete'
  | 'deposit'
  | 'duplicate'
  | 'editPrices'
  | 'pause'
  | 'renew'
  | 'undercut'
  | 'withdraw';
export type DebugTokens = keyof typeof debugTokens;

export interface MinMax {
  min: string;
  max: string;
}

export interface RangeOrder extends MinMax {
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
