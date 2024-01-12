import { test } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import { DebugDriver, removeFork, setupFork } from '../utils/DebugDriver';
import { CreateStrategyTestCase } from '../utils/strategy';
import * as recurring from '../tests/strategy/recurring/';
import * as disposable from '../tests/strategy/disposable/';
import * as overlapping from '../tests/strategy/overlapping/';

const testCases: CreateStrategyTestCase[] = [
  {
    input: {
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
    output: {
      create: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,500 DAI',
          max: '1,500 DAI',
          budget: '10 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,700 DAI',
          max: '1,700 DAI',
          budget: '2 ETH',
          fiat: '$3,334.42',
        },
      },
    },
  },
  {
    input: {
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
    output: {
      create: {
        totalFiat: '$25.11',
        buy: {
          min: '0.3 USDC',
          max: '0.545454 USDC',
          budget: '12.5 USDC',
          fiat: '$12.50',
        },
        sell: {
          min: '0.33 USDC',
          max: '0.6 USDC',
          budget: '30 BNT',
          fiat: '$12.61',
        },
      },
    },
  },
];

const testDescription = (testCase: CreateStrategyTestCase) => {
  const input = testCase.input;
  if (input.type === 'overlapping') return 'Overlapping';
  if (input.type === 'disposable') return `Disposable ${input.setting}`;
  return `Recurring ${input.setting.split('_').join(' ')}`;
};

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(180_000);
    await setupFork(testInfo);
    const debug = new DebugDriver(page);
    await debug.visit();
    await debug.setRpcUrl(testInfo);
    await Promise.all([mockApi(page), debug.setupImposter(), debug.setE2E()]);
  });
  test.afterEach(async ({}, testInfo) => {
    await removeFork(testInfo);
  });

  const testStrategies = {
    recurring,
    disposable,
    overlapping,
  };

  for (const testCase of testCases) {
    test.describe(testDescription(testCase), () => {
      const testSuite = testStrategies[testCase.input.type];
      for (const [, testFn] of Object.entries(testSuite)) {
        testFn(testCase);
      }
    });
  }
});
