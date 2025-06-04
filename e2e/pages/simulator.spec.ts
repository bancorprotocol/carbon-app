import { test } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import {
  DebugDriver,
  removeFork,
  setupVirtualNetwork,
  setupLocalStorage,
} from '../utils/DebugDriver';
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
        start: '2023-03-02',
        end: '2024-02-25',
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
      roi: '-29.91%',
      estimatedGains: 'DAI -9,904.69',
      date: 'Mar 02, 2023 - Feb 25, 2024',
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
  {
    type: 'recurring',
    setting: 'range_limit',
    base: 'ETH',
    quote: 'USDC',
    input: {
      dates: {
        start: '2023-03-10',
        end: '2024-01-24',
      },
      buy: {
        min: '1700',
        max: '1800',
        budget: '200',
      },
      sell: {
        min: '2100',
        max: '2100',
        budget: '1',
      },
    },
    output: {
      roi: '15.49%',
      estimatedGains: 'USDC 376.75',
      date: 'Mar 10, 2023 - Jan 24, 2024',
      buy: {
        rate: '1,700.00 - 1,800.00 USDC per ETH',
        budget: '200.00 USDC',
      },
      sell: {
        rate: '2,100.00 USDC per ETH',
        budget: '1.00 ETH',
      },
    },
  },
  {
    type: 'recurring',
    setting: 'limit_range',
    base: 'ETH',
    quote: 'SHIB',
    input: {
      dates: {
        start: '2023-03-08',
        end: '2024-01-21',
      },
      buy: {
        min: '222000000',
        max: '222000000',
        budget: '1000000000',
      },
      sell: {
        min: '240000000',
        max: '270000000',
        budget: '1',
      },
    },
    output: {
      roi: '32.23%',
      estimatedGains: 'SHIB 407,118,924.87',
      date: 'Mar 08, 2023 - Jan 21, 2024',
      buy: {
        rate: '222.00M SHIB per ETH',
        budget: '1.00B SHIB',
      },
      sell: {
        rate: '240.00M - 270.00M SHIB per ETH',
        budget: '1.00 ETH',
      },
    },
  },
  {
    type: 'recurring',
    setting: 'limit_limit',
    base: 'ETH',
    quote: 'SHIB',
    input: {
      dates: {
        start: '2023-03-01',
        end: '2024-02-21',
      },
      buy: {
        min: '222000000',
        max: '222000000',
        budget: '100000000',
      },
      sell: {
        min: '240000000',
        max: '240000000',
        budget: '10',
      },
    },
    output: {
      roi: '-8.87%',
      estimatedGains: 'SHIB -285,338,714.67',
      date: 'Mar 01, 2023 - Feb 21, 2024',
      buy: {
        rate: '222.00M SHIB per ETH',
        budget: '100.00M SHIB',
      },
      sell: {
        rate: '240.00M SHIB per ETH',
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
    await mockApi(page);
    await page.clock.setFixedTime(new Date('2024-02-26T00:00:00.000Z'));
    const vNet = await setupVirtualNetwork(testInfo);
    const rpc = vNet.rpcs.find(({ name }) => name === 'Admin RPC')!.url;
    await setupLocalStorage(page, rpc);
    const debug = new DebugDriver(page);
    await debug.visit();
  });
  // Need an empty object else the tests don't run
  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    await removeFork(testInfo);
  });

  const testStrategies = {
    recurring,
    overlapping,
  };

  for (const testCase of testCases) {
    test.describe(testCase.type, () => {
      const testSuite = testStrategies[testCase.type];
      for (const testFn of Object.values(testSuite)) {
        testFn(testCase);
      }
    });
  }
});
