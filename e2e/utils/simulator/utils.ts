import {
  CreateStrategyTestCase,
  RecurringStrategyTestCase,
  OverlappingStrategyTestCase,
} from './types';
import { DebugTokens, debugTokens, Setting } from '../types';

export function isRecurringTestCase(
  testCase: CreateStrategyTestCase
): testCase is RecurringStrategyTestCase {
  return testCase.type === 'recurring';
}
export function assertRecurringTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is RecurringStrategyTestCase {
  if (isRecurringTestCase(testCase)) return;
  throw new Error('Test case should be recurring');
}

export function isOverlappingTestCase(
  testCase: CreateStrategyTestCase
): testCase is OverlappingStrategyTestCase {
  return testCase.type === 'overlapping';
}
export function assertOverlappingTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is OverlappingStrategyTestCase {
  if (isOverlappingTestCase(testCase)) return;
  throw new Error('Test case should be overlapping');
}

export const getRecurringSettings = (testCase: RecurringStrategyTestCase) => {
  return testCase.setting.split('_') as [Setting, Setting];
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

export const testDescription = (testCase: CreateStrategyTestCase) => {
  if (isOverlappingTestCase(testCase)) return 'Overlapping';
  return `Recurring_${testCase.setting}`;
};

export const screenshotPath = (
  testCase: CreateStrategyTestCase,
  filename: string
) => {
  const description = testDescription(testCase);
  return `/simulator/${testCase.type}/${description}/${filename}`;
};
