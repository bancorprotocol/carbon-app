import { DebugTokens, Direction } from '../types';

export type TestCaseSwap = {
  sourceValue: string;
  targetValue: string;
};

export type TradeTestCase = {
  mode: Direction;
  base: DebugTokens;
  quote: DebugTokens;
  isLimitedApproval?: boolean;
  swaps: TestCaseSwap[];
};
