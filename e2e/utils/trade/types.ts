import { DebugTokens, Direction } from '../types';

export type TestCaseSwap = {
  sourceValue: string;
  targetValue: string;
};

export type TradeTestCase = {
  mode: Direction;
  source: DebugTokens;
  target: DebugTokens;
  isLimitedApproval?: boolean;
  swaps: TestCaseSwap[];
};
