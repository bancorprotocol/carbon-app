import { test } from '@playwright/test';
import * as recurring from '../tests/strategy/recurring/';
import * as disposable from '../tests/strategy/disposable/';
import * as overlapping from '../tests/strategy/overlapping/';

import { StrategyType } from './../utils/strategy/template';
import { navigateTo, screenshot } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { DebugDriver, removeFork, setupFork } from '../utils/DebugDriver';
import {
  MyStrategyDriver,
  OverlappingStrategyTestCase,
  RecurringStrategyTestCase,
} from '../utils/strategy';

type TestCase = (RecurringStrategyTestCase | OverlappingStrategyTestCase) & {
  type: StrategyType;
};

const testCases: TestCase[] = [
  {
    type: 'recurring',
    setting: 'limit_limit',
    base: 'ETH',
    quote: 'DAI',
    buy: {
      min: '1500',
      max: '1500',
      budget: '10',
      budgetFiat: '10',
    },
    sell: {
      min: '1700',
      max: '1700',
      budget: '2',
      budgetFiat: '3334',
    },
  },
  {
    type: 'overlapping',
    base: 'BNT',
    quote: 'USDC',
    buy: {
      min: '0.3',
      max: '0.545454',
      budget: '12.501572',
      budgetFiat: '12.5',
    },
    sell: {
      min: '0.33',
      max: '0.6',
      budget: '30',
      budgetFiat: '12.61',
    },
    spread: '10', // Need a large spread for tooltip test
  },
];

const testDescription = (testCase: TestCase) => {
  if (testCase.type === 'overlapping') return 'Overlapping';
  if (testCase.type === 'disposable') return `Disposable ${testCase.setting}`;
  return `Recurring ${testCase.setting.split('_').join(' ')}`;
};

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(180_000);
    await setupFork(testInfo);
    const debug = new DebugDriver(page);
    await debug.visit();
    await debug.setRpcUrl(testInfo);
    await Promise.all([mockApi(page), debug.setupImposter()]);
  });
  test.afterEach(async ({}, testInfo) => {
    await removeFork(testInfo);
  });

  test('First Strategy Page', async ({ page }) => {
    await navigateTo(page, '/');
    const driver = new MyStrategyDriver(page);
    await driver.firstStrategy().waitFor({ state: 'visible' });
    await screenshot(page, 'first-strategy');
  });

  const testStrategies = {
    recurring,
    disposable,
    overlapping,
  };

  for (const testCase of testCases) {
    test.describe(testDescription(testCase), () => {
      const testSuite = testStrategies[testCase.type];
      for (const [, testFn] of Object.entries(testSuite)) {
        testFn(testCase);
      }
    });
  }
});
