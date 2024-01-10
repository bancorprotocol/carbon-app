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
import { mockApi } from '../utils/mock-api';
import { DebugDriver, removeFork, setupFork } from '../utils/DebugDriver';

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
  {
    type: 'Overlapping',
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

const createStrategy: CreateStrategy = {
  Limit: createLimitStrategy,
  Overlapping: createOverlappingStrategy,
  Range: () => {},
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
