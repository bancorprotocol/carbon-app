import { test } from '@playwright/test';
import * as recurring from '../tests/strategy/recurring/';
import * as disposable from '../tests/strategy/disposable/';
import * as overlapping from '../tests/strategy/overlapping/';

import { StrategyType } from './../utils/strategy/template';
import { navigateTo, screenshot } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { removeFork, setupFork, setupImposter } from '../utils/DebugDriver';
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
    type: 'Recurring',
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
  // {
  //   type: 'Range',
  //   base: 'ETH',
  //   quote: 'DAI',
  //   buy: {
  //     min: '1500',
  //     max: '1600',
  //     budget: '10',
  //     budgetFiat: '10',
  //   },
  //   sell: {
  //     min: '1700',
  //     max: '1800',
  //     budget: '2',
  //     budgetFiat: '3334',
  //   },
  // },
];

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await setupFork(page, testInfo);
    await Promise.all([mockApi(page), setupImposter(page)]);
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
    Recurring: recurring,
    Disposable: disposable,
    Overlapping: overlapping,
  };

  for (const testCase of testCases) {
    test.describe(testCase.type + ' ' + testCase.setting, () => {
      const testSuite = testStrategies[testCase.type];
      for (const [, testFn] of Object.entries(testSuite)) {
        testFn(testCase);
      }
    });
  }
});
