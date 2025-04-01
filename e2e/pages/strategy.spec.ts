import { test } from '@playwright/test';
import { mockApi } from '../utils/mock-api';
import {
  DebugDriver,
  removeFork,
  setupVirtualNetwork,
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
  {
    type: 'disposable',
    setting: 'limit',
    direction: 'sell',
    base: 'ETH',
    quote: 'DAI',
    input: {
      create: fromLimitOrder({ price: '1700', budget: '2' }),
      editPrices: fromPrice('1800'),
      deposit: '1',
      withdraw: '1',
    },
    output: {
      create: {
        min: '1,700.00 DAI',
        max: '1,700.00 DAI',
        outcomeValue: '3,400.00 DAI',
        outcomeQuote: '1,700.00 DAI',
        budget: '2.00 ETH',
        fiat: '$3,334.42',
      },
      undercut: {
        min: '1,698.30 DAI',
        max: '1,698.30 DAI',
      },
      editPrices: {
        min: '1,800.00 DAI',
        max: '1,800.00 DAI',
      },
      deposit: '3.00 ETH',
      withdraw: '1.00 ETH',
    },
  },
  {
    type: 'disposable',
    setting: 'range',
    direction: 'buy',
    base: 'ETH',
    quote: 'DAI',
    input: {
      create: {
        min: '1500',
        max: '1700',
        budget: '10',
      },
      editPrices: {
        min: '1600',
        max: '1800',
      },
      deposit: '2',
      withdraw: '2',
    },
    output: {
      create: {
        min: '1,500.00 DAI',
        max: '1,700.00 DAI',
        outcomeValue: '0.006262 ETH',
        outcomeQuote: '1,596.87 DAI',
        budget: '10.00 DAI',
        fiat: '$10.00',
      },
      undercut: {
        min: '1,501.50 DAI',
        max: '1,701.70 DAI',
      },
      editPrices: {
        min: '1,600.00 DAI',
        max: '1,800.00 DAI',
      },
      deposit: '12.00 DAI',
      withdraw: '8.00 DAI',
    },
  },
  {
    type: 'disposable',
    setting: 'range',
    direction: 'sell',
    base: 'ETH',
    quote: 'DAI',
    input: {
      create: {
        min: '1500',
        max: '1700',
        budget: '2',
      },
      editPrices: {
        min: '1600',
        max: '1800',
      },
      deposit: '1',
      withdraw: '1',
    },
    output: {
      create: {
        min: '1,500.00 DAI',
        max: '1,700.00 DAI',
        outcomeValue: '3,193.74 DAI',
        outcomeQuote: '1,596.87 DAI',
        budget: '2.00 ETH',
        fiat: '$3,334.42',
      },
      undercut: {
        min: '1,498.50 DAI',
        max: '1,698.30 DAI',
      },
      editPrices: {
        min: '1,600.00 DAI',
        max: '1,800.00 DAI',
      },
      deposit: '3.00 ETH',
      withdraw: '1.00 ETH',
    },
  },
  // Recurring
  {
    type: 'recurring',
    setting: 'limit_limit',
    base: 'ETH',
    quote: 'DAI',
    input: {
      create: {
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
      editPrices: {
        buy: {
          min: '1600',
          max: '1600',
        },
        sell: {
          min: '1800',
          max: '1800',
        },
      },
      deposit: {
        buy: '5',
        sell: '1',
      },
      withdraw: {
        buy: '5',
        sell: '1',
      },
    },
    output: {
      create: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,500.00 DAI',
          max: '1,500.00 DAI',
          outcomeValue: '0.006666 ETH',
          outcomeQuote: '1,500.00 DAI',
          budget: '10.00 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,700.00 DAI',
          max: '1,700.00 DAI',
          outcomeValue: '3,400.00 DAI',
          outcomeQuote: '1,700.00 DAI',
          budget: '2.00 ETH',
          fiat: '$3,334.42',
        },
      },
      undercut: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,501.50 DAI',
          max: '1,501.50 DAI',
          budget: '10.00 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,698.30 DAI',
          max: '1,698.30 DAI',
          budget: '2.00 ETH',
          fiat: '$3,334.42',
        },
      },
      editPrices: {
        buy: {
          min: '1,600.00 DAI',
          max: '1,600.00 DAI',
        },
        sell: {
          min: '1,800.00 DAI',
          max: '1,800.00 DAI',
        },
      },
      deposit: {
        buy: '15.00 DAI',
        sell: '3.00 ETH',
      },
      withdraw: {
        buy: '5.00 DAI',
        sell: '1.00 ETH',
      },
    },
  },
  {
    type: 'recurring',
    setting: 'range_limit',
    base: 'ETH',
    quote: 'DAI',
    input: {
      create: {
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
      editPrices: {
        buy: {
          min: '1600',
          max: '1700',
        },
        sell: {
          min: '1800',
          max: '1800',
        },
      },
      deposit: {
        buy: '5',
        sell: '1',
      },
      withdraw: {
        buy: '5',
        sell: '1',
      },
    },
    output: {
      create: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,500.00 DAI',
          max: '1,600.00 DAI',
          outcomeValue: '0.006454 ETH',
          outcomeQuote: '1,549.19 DAI',
          budget: '10.00 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,700.00 DAI',
          max: '1,700.00 DAI',
          outcomeValue: '3,400.00 DAI',
          outcomeQuote: '1,700.00 DAI',
          budget: '2.00 ETH',
          fiat: '$3,334.42',
        },
      },
      undercut: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,501.50 DAI',
          max: '1,601.60 DAI',
          budget: '10.00 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,698.30 DAI',
          max: '1,698.30 DAI',
          budget: '2.00 ETH',
          fiat: '$3,334.42',
        },
      },
      editPrices: {
        buy: {
          min: '1,600.00 DAI',
          max: '1,700.00 DAI',
        },
        sell: {
          min: '1,800.00 DAI',
          max: '1,800.00 DAI',
        },
      },
      deposit: {
        buy: '15.00 DAI',
        sell: '3.00 ETH',
      },
      withdraw: {
        buy: '5.00 DAI',
        sell: '1.00 ETH',
      },
    },
  },
  {
    type: 'recurring',
    setting: 'limit_range',
    base: 'ETH',
    quote: 'DAI',
    input: {
      create: {
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
      editPrices: {
        buy: {
          min: '1600',
          max: '1600',
        },
        sell: {
          min: '1800',
          max: '1900',
        },
      },
      deposit: {
        buy: '5',
        sell: '1',
      },
      withdraw: {
        buy: '5',
        sell: '1',
      },
    },
    output: {
      create: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,500.00 DAI',
          max: '1,500.00 DAI',
          outcomeValue: '0.006666 ETH',
          outcomeQuote: '1,500.00 DAI',
          budget: '10.00 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,700.00 DAI',
          max: '1,800.00 DAI',
          outcomeValue: '3,498.57 DAI',
          outcomeQuote: '1,749.28 DAI',
          budget: '2.00 ETH',
          fiat: '$3,334.42',
        },
      },
      undercut: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,501.50 DAI',
          max: '1,501.50 DAI',
          budget: '10.00 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,698.30 DAI',
          max: '1,798.20 DAI',
          budget: '2.00 ETH',
          fiat: '$3,334.42',
        },
      },
      editPrices: {
        buy: {
          min: '1,600.00 DAI',
          max: '1,600.00 DAI',
        },
        sell: {
          min: '1,800.00 DAI',
          max: '1,900.00 DAI',
        },
      },
      deposit: {
        buy: '15.00 DAI',
        sell: '3.00 ETH',
      },
      withdraw: {
        buy: '5.00 DAI',
        sell: '1.00 ETH',
      },
    },
  },
  {
    type: 'recurring',
    setting: 'range_range',
    base: 'ETH',
    quote: 'DAI',
    input: {
      create: {
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
      editPrices: {
        buy: {
          min: '1600',
          max: '1700',
        },
        sell: {
          min: '1800',
          max: '1900',
        },
      },
      deposit: {
        buy: '5',
        sell: '1',
      },
      withdraw: {
        buy: '5',
        sell: '1',
      },
    },
    output: {
      create: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,500.00 DAI',
          max: '1,600.00 DAI',
          outcomeValue: '0.006454 ETH',
          outcomeQuote: '1,549.19 DAI',
          budget: '10.00 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,700.00 DAI',
          max: '1,800.00 DAI',
          outcomeValue: '3,498.57 DAI',
          outcomeQuote: '1,749.28 DAI',
          budget: '2.00 ETH',
          fiat: '$3,334.42',
        },
      },
      undercut: {
        totalFiat: '$3,344.42',
        buy: {
          min: '1,501.50 DAI',
          max: '1,601.60 DAI',
          budget: '10.00 DAI',
          fiat: '$10.00',
        },
        sell: {
          min: '1,698.30 DAI',
          max: '1,798.20 DAI',
          budget: '2.00 ETH',
          fiat: '$3,334.42',
        },
      },
      editPrices: {
        buy: {
          min: '1,600.00 DAI',
          max: '1,700.00 DAI',
        },
        sell: {
          min: '1,800.00 DAI',
          max: '1,900.00 DAI',
        },
      },
      deposit: {
        buy: '15.00 DAI',
        sell: '3.00 ETH',
      },
      withdraw: {
        buy: '5.00 DAI',
        sell: '1.00 ETH',
      },
    },
  },
  // Overlapping
  {
    type: 'overlapping',
    base: 'BNT',
    quote: 'USDC',
    input: {
      baseStrategy: {
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
        spread: '10',
      },
      create: {
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
      editPrices: {
        min: '0.2',
        max: '0.7',
        spread: '15',
        anchor: 'buy',
        action: 'deposit',
        budget: '10',
      },
      withdraw: {
        anchor: 'sell',
        budget: '10',
      },
      deposit: {
        anchor: 'sell',
        budget: '10',
      },
    },
    output: {
      create: {
        totalFiat: '$25.11',
        buy: {
          min: '0.299999 USDC',
          max: '0.545454 USDC',
          marginal: '0.400853 USDC',
          spread: '10%',
          budget: '12.50 USDC',
          fiat: '$12.50',
        },
        sell: {
          min: '0.33 USDC',
          max: '0.60 USDC',
          marginal: '0.440939 USDC',
          spread: '10%',
          budget: '30.00 BNT',
          fiat: '$12.61',
        },
      },
      undercut: {
        totalFiat: '$25.10',
        buy: {
          min: '0.299999 USDC',
          max: '0.54595 USDC',
          marginal: '0.401036 USDC',
          spread: '9.9%',
          budget: '12.49 USDC',
          fiat: '$12.49',
        },
        sell: {
          min: '0.329699 USDC',
          max: '0.60 USDC',
          marginal: '0.440738 USDC',
          spread: '9.9%',
          budget: '30.00 BNT',
          fiat: '$12.61',
        },
      },
      editPrices: {
        totalFiat: '$39.17',
        buy: {
          min: '0.199999 USDC',
          max: '0.608695 USDC',
          marginal: '0.392042 USDC',
          spread: '15.000001%',
          budget: '22.50 USDC',
          fiat: '$22.50',
        },
        sell: {
          min: '0.23 USDC',
          max: '0.70 USDC',
          marginal: '0.450849 USDC',
          spread: '15.000001%',
          budget: '39.66 BNT',
          fiat: '$16.67',
        },
      },
      withdraw: { buy: '8.3343 USDC', sell: '20.00 BNT' },
      deposit: { buy: '16.66 USDC', sell: '40.00 BNT' },
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
    const vNet = await setupVirtualNetwork(testInfo);
    const rpc = vNet.rpcs.find(({ name }) => name === 'Admin RPC')!.url;
    await setupLocalStorage(page, rpc);
    const debug = new DebugDriver(page);
    await debug.visit();
    await debug.setupImposter();
  });
  // Need an empty object else the tests don't run
  // eslint-disable-next-line no-empty-pattern
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
