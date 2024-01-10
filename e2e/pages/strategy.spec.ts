import { test } from '@playwright/test';
import { createLimitStrategy } from './../tests/strategy/createLimit';
import { createOverlappingStrategy } from './../tests/strategy/createOverlapping';
import { deleteStrategyTest } from './../tests/strategy/delete';
import { duplicateStrategyTest } from './../tests/strategy/duplicate';
import { renewStrategyTest } from './../tests/strategy/renew';
import { pauseStrategyTest } from './../tests/strategy/pause';
import { withdrawStrategyTest } from './../tests/strategy/withdraw';
import { depositStrategyTest } from './../tests/strategy/deposit';
import { editPriceStrategyTest } from '../tests/strategy/edit';
import {
  CreateStrategyTemplate,
  StrategyType,
} from './../utils/strategy/template';
import { navigateTo, screenshot } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { removeFork, setupFork, setupImposter } from '../utils/DebugDriver';
import { MyStrategyDriver } from '../utils/strategy';

type Config = CreateStrategyTemplate & { type: StrategyType };

type CreateStrategy = {
  [key in StrategyType]: (c: CreateStrategyTemplate) => void;
};

const configs: Config[] = [
  {
    type: 'Limit',
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

const createStrategy: CreateStrategy = {
  Limit: createLimitStrategy,
  Overlapping: createOverlappingStrategy,
  Range: () => {},
};

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

  for (const config of configs) {
    test.describe(config.type, () => {
      createStrategy[config.type](config);
      editPriceStrategyTest(config);
      depositStrategyTest(config);
      withdrawStrategyTest(config);
      pauseStrategyTest(config);
      renewStrategyTest(config);
      duplicateStrategyTest(config);
      deleteStrategyTest(config);
    });
  }
});
