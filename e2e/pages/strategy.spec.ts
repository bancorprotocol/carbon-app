import { test } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import { DebugDriver, removeFork, setupFork } from '../utils/DebugDriver';
import { CreateStrategyTestCase } from '../utils/strategy';
import * as recurring from '../tests/strategy/recurring/';
import * as disposable from '../tests/strategy/disposable/';
import * as overlapping from '../tests/strategy/overlapping/';

const testCases: CreateStrategyTestCase[] = [
  // Disposable
  {
    input: {
      type: 'disposable',
      setting: 'limit',
      direction: 'buy',
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '1500',
        max: '1500',
        budget: '10',
      },
      sell: {
        min: '0',
        max: '0',
        budget: '0',
      },
    },
    output: {
      create: {
        buy: {
          min: '1,500 DAI',
          max: '1,500 DAI',
          outcomeValue: '0.006666 ETH',
          outcomeQuote: '1,500 DAI',
          budget: '10 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '0 DAI',
          max: '0 DAI',
          outcomeValue: '0 ETH',
          outcomeQuote: '0 ETH',
          budget: '0 ETH',
          fiat: '$0.00',
        },
      },
    },
  },
  {
    input: {
      type: 'disposable',
      setting: 'limit',
      direction: 'sell',
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '0',
        max: '0',
        budget: '0',
      },
      sell: {
        min: '1700',
        max: '1700',
        budget: '2',
      },
    },
    output: {
      create: {
        buy: {
          min: '0 DAI',
          max: '0 DAI',
          outcomeValue: '0 ETH',
          outcomeQuote: '0 ETH',
          budget: '0 DAI',
          fiat: '$0.00',
        },
        sell: {
          min: '1,700 DAI',
          max: '1,700 DAI',
          outcomeValue: '3,400 DAI',
          outcomeQuote: '1,700 DAI',
          budget: '2 ETH',
          fiat: '$3,334.42',
        },
      },
    },
  },
  {
    input: {
      type: 'disposable',
      setting: 'range',
      direction: 'buy',
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '1500',
        max: '1700',
        budget: '10',
      },
      sell: {
        min: '0',
        max: '0',
        budget: '0',
      },
    },
    output: {
      create: {
        buy: {
          min: '1,500 DAI',
          max: '1,700 DAI',
          outcomeValue: '0.006262 ETH',
          outcomeQuote: '1,596 DAI',
          budget: '10 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '0 DAI',
          max: '0 DAI',
          outcomeValue: '0 ETH',
          outcomeQuote: '0 ETH',
          budget: '0 ETH',
          fiat: '$0.00',
        },
      },
    },
  },
  {
    input: {
      type: 'disposable',
      setting: 'range',
      direction: 'sell',
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '0',
        max: '0',
        budget: '0',
      },
      sell: {
        min: '1500',
        max: '1700',
        budget: '2',
      },
    },
    output: {
      create: {
        buy: {
          min: '0 DAI',
          max: '0 DAI',
          outcomeValue: '0 ETH',
          outcomeQuote: '0 ETH',
          budget: '0 DAI',
          fiat: '$0.00',
        },
        sell: {
          min: '1,500 DAI',
          max: '1,700 DAI',
          outcomeValue: '3,193 DAI',
          outcomeQuote: '1,596 DAI',
          budget: '2 ETH',
          fiat: '$3,334.42',
        },
      },
    },
  },
  // Recurring
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
      },
      sell: {
        min: '1700',
        max: '1700',
        budget: '2',
      },
    },
    output: {
      create: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,500 DAI',
          max: '1,500 DAI',
          outcomeValue: '0.006666 ETH',
          outcomeQuote: '1,500 DAI',
          budget: '10 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,700 DAI',
          max: '1,700 DAI',
          outcomeValue: '3,400 DAI',
          outcomeQuote: '1,700 DAI',
          budget: '2 ETH',
          fiat: '$3,334.42',
        },
      },
    },
  },
  {
    input: {
      type: 'recurring',
      setting: 'limit_range',
      base: 'ETH',
      baseAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      quote: 'DAI',
      quoteAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      buy: {
        min: '1500',
        max: '1500',
        budget: '10',
      },
      sell: {
        min: '1700',
        max: '1800',
        budget: '2',
      },
    },
    output: {
      create: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,500 DAI',
          max: '1,500 DAI',
          outcomeValue: '0.006666 ETH',
          outcomeQuote: '1,500 DAI',
          budget: '10 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,700 DAI',
          max: '1,800 DAI',
          outcomeValue: '3,498 DAI',
          outcomeQuote: '1,749 DAI',
          budget: '2 ETH',
          fiat: '$3,334.42',
        },
      },
    },
  },
  {
    input: {
      type: 'recurring',
      setting: 'range_limit',
      base: 'ETH',
      baseAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      quote: 'DAI',
      quoteAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      buy: {
        min: '1500',
        max: '1600',
        budget: '10',
      },
      sell: {
        min: '1700',
        max: '1700',
        budget: '2',
      },
    },
    output: {
      create: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,500 DAI',
          max: '1,600 DAI',
          outcomeValue: '0.006454 ETH',
          outcomeQuote: '1,549 DAI',
          budget: '10 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,700 DAI',
          max: '1,700 DAI',
          outcomeValue: '3,400 DAI',
          outcomeQuote: '1,700 DAI',
          budget: '2 ETH',
          fiat: '$3,334.42',
        },
      },
    },
  },
  {
    input: {
      type: 'recurring',
      setting: 'range_range',
      base: 'ETH',
      baseAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      quote: 'DAI',
      quoteAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      buy: {
        min: '1500',
        max: '1600',
        budget: '10',
      },
      sell: {
        min: '1700',
        max: '1800',
        budget: '2',
      },
    },
    output: {
      create: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,500 DAI',
          max: '1,600 DAI',
          outcomeValue: '0.006454 ETH',
          outcomeQuote: '1,549 DAI',
          budget: '10 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,700 DAI',
          max: '1,800 DAI',
          outcomeValue: '3,498 DAI',
          outcomeQuote: '1,749 DAI',
          budget: '2 ETH',
          fiat: '$3,334.42',
        },
      },
    },
  },
  // Overlapping
  {
    input: {
      type: 'overlapping',
      base: 'BNT',
      quote: 'USDC',
      buy: {
        min: '0.3',
        max: '0.545454',
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
  if (input.type === 'disposable') {
    return `Disposable ${input.direction} ${input.setting}`;
  }
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
