import { test } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import {
  DebugDriver,
  removeFork,
  setupFork,
  setupLocalStorage,
} from '../utils/DebugDriver';
import {
  CreateStrategyTestCase,
  fromLimitOrder,
  fromPrice,
} from '../utils/strategy';
import * as recurring from '../tests/strategy/recurring/';
import * as disposable from '../tests/strategy/disposable/';
import * as overlapping from '../tests/strategy/overlapping/';

const testCases: CreateStrategyTestCase[] = [
  // Disposable
  {
    type: 'disposable',
    setting: 'limit',
    direction: 'buy',
    base: 'ETH',
    quote: 'DAI',
    input: {
      create: fromLimitOrder({ price: '1500', budget: '10' }),
      editPrices: fromPrice('1600'),
      deposit: '5',
      withdraw: '5',
    },
    output: {
      create: {
        min: '1,500.00 DAI',
        max: '1,500.00 DAI',
        outcomeValue: '0.006666 ETH',
        outcomeQuote: '1,500.00 DAI',
        budget: '10.00 DAI',
        fiat: '$10.00',
      },
      undercut: {
        min: '1,501.50 DAI',
        max: '1,501.50 DAI',
      },
      editPrices: {
        min: '1,600.00 DAI',
        max: '1,600.00 DAI',
      },
      deposit: '15.00 DAI',
      withdraw: '5.00 DAI',
    },
  },
];

const testDescription = (testCase: CreateStrategyTestCase) => {
  if (testCase.type === 'overlapping') return 'Overlapping';
  if (testCase.type === 'disposable') {
    return `Disposable_${testCase.direction}_${testCase.setting}`;
  }
  return `Recurring_${testCase.setting}`;
};

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await mockApi(page);
    await setupFork(testInfo);
    await setupLocalStorage(page, testInfo);
    const debug = new DebugDriver(page);
    await debug.visit();
    await debug.setupImposter();
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
      const testSuite = testStrategies[testCase.type];
      for (const testFn of Object.values(testSuite)) {
        testFn(testCase);
      }
    });
  }
});
