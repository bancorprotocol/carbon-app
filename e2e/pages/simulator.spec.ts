import { test } from '@playwright/test';
import { capitalize } from 'lodash';
import { mockApi } from '../utils/mock-api';
import { DebugDriver, removeFork, setupFork } from '../utils/DebugDriver';
import { CreateStrategyTestCase } from '../utils/simulator';
import * as recurring from '../tests/simulator/recurring';
import * as overlapping from '../tests/simulator/overlapping';

const testCases: CreateStrategyTestCase[] = [
  // Recurring
  {
    type: 'recurring',
    setting: 'range_range',
    base: 'ETH',
    quote: 'DAI',
    input: {
      dates: {
        start: 'March 02, 2023',
        end: 'February 25, 2024',
      },
      buy: {
        min: '1500',
        max: '1600',
        budget: '2000',
      },
      sell: {
        min: '1700',
        max: '2000',
        budget: '10',
      },
    },
    output: {
      roi: '-79.93%',
      estimatedGains: 'DAI -25,492.02',
      date: 'March 02, 2023 - February 25, 2024',
      buy: {
        rate: '1,500.00 - 1,600.00 DAI per ETH',
        budget: '2,000.00 DAI',
      },
      sell: {
        rate: '1,700.00 - 2,000.00 DAI per ETH',
        budget: '10.00 ETH',
      },
    },
  },
  // Overlapping
  {
    type: 'overlapping',
    base: 'BNT',
    quote: 'USDC',
    input: {
      dates: {
        start: '',
        end: '',
      },
      buy: {
        min: '0.3',
        max: '0.545455',
        budget: '12.501572',
      },
      sell: {
        min: '0.33',
        max: '0.6',
        budget: '30',
      },
      spread: '10', // Need a large spread for tooltip test
    },
    output: {
      roi: '0%',
      estimatedGains: '0%',
      buy: {
        rate: '',
        budget: '',
      },
      sell: {
        rate: '',
        budget: '',
      },
      date: '',
    },
  },
];

test.describe('Simulator', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(120_000);
    await mockApi(page);
    await setupFork(testInfo);
    const debug = new DebugDriver(page);
    await debug.visit();
    await debug.setRpcUrl(testInfo);
    await debug.setE2E();
  });
  test.afterEach(async ({}, testInfo) => {
    await removeFork(testInfo);
  });

  const testStrategies = {
    recurring,
    overlapping,
  };

  for (const testCase of testCases) {
    test.describe(capitalize(testCase.type), () => {
      const testSuite = testStrategies[testCase.type];
      for (const testFn of Object.values(testSuite)) {
        testFn(testCase);
      }
    });
  }
});
