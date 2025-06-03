import { DebugTokens, TokenPair, Setting, RangeOrder } from '../types';

export type SimulatorChartTypes = 'animation' | 'summary';

interface Dates {
  start: string;
  end: string;
}

export type StrategyType = 'recurring' | 'overlapping';

export interface CreateStrategyInput {
  buy: RangeOrder;
  sell: RangeOrder;
  dates: Dates;
  spread?: string;
}

export interface CreateStrategyOutput {
  buy: OrderOutput;
  sell: OrderOutput;
  roi: string;
  estimatedGains: string;
  date: string;
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
  rate: string;
  budget: string;
}

///////////////
// RECURRING //
///////////////

export interface RecurringStrategyTestCase {
  type: 'recurring';
  setting: `${Setting}_${Setting}`;
  base: DebugTokens;
  quote: DebugTokens;
  input: CreateStrategyInput;
  output: CreateStrategyOutput;
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
  input: CreateOverlappingStrategyInput;
  output: CreateStrategyOutput;
}

export type CreateStrategyTestCase =
  | RecurringStrategyTestCase
  | OverlappingStrategyTestCase;

/** Use to create a generic strategy in the debug page */
export interface DebugStrategy extends CreateStrategyInput {
  spread?: string;
}
