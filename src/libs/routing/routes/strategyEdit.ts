import { createRoute } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  searchValidator,
  validMarginalPrice,
  validNumber,
  validInputNumber,
} from '../utils';
import { EditStrategyRoot } from 'pages/portfolio/edit/root';
import {
  EditPricesStrategyRecurringPage,
  EditRecurringStrategySearch,
} from 'pages/portfolio/edit/prices/recurring';
import { Strategy } from 'components/strategies/common/types';
import { isEmptyOrder, isZero } from 'components/strategies/common/utils';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import { isOverlappingStrategy } from 'components/strategies/common/utils';
import {
  EditDisposableStrategySearch,
  EditPricesStrategyDisposablePage,
} from 'pages/portfolio/edit/prices/disposable';
import {
  EditOverlappingStrategySearch,
  EditPricesOverlappingPage,
} from 'pages/portfolio/edit/prices/overlapping';
import { EditBudgetRecurringPage } from 'pages/portfolio/edit/budget/recurring';
import { EditBudgetDisposablePage } from 'pages/portfolio/edit/budget/disposable';
import { EditBudgetOverlappingPage } from 'pages/portfolio/edit/budget/overlapping';
import { SafeDecimal } from 'libs/safedecimal';
import * as v from 'valibot';

export type EditTypes = 'renew' | 'editPrices' | 'deposit' | 'withdraw';

export const editStrategyLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/strategies/edit/$strategyId',
  component: EditStrategyRoot,
  validateSearch: searchValidator({
    chartStart: v.optional(validNumber),
    chartEnd: v.optional(validNumber),
    editType: v.picklist(['editPrices', 'renew', 'deposit', 'withdraw']),
  }),
});

// PRICES
const initInput = (value: string) => {
  if (isZero(value)) return;
  return value;
};

export const toDisposablePricesSearch = (
  strategy: Strategy,
  editType: 'editPrices' | 'renew',
): EditDisposableStrategySearch => {
  const { buy, sell } = strategy;
  const direction = isEmptyOrder(buy) ? 'sell' : 'buy';
  const order = direction === 'sell' ? sell : buy;
  return {
    editType,
    min: initInput(order.min),
    max: initInput(order.max),
    settings: order.min === order.max ? 'limit' : 'range',
    direction,
  };
};
export const editPrice = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'prices',
  validateSearch: searchValidator({
    marketPrice: v.optional(validNumber),
  }),
});
export const editPricesDisposable = createRoute({
  getParentRoute: () => editPrice,
  path: 'disposable',
  component: EditPricesStrategyDisposablePage,
  validateSearch: searchValidator({
    editType: v.picklist(['editPrices', 'renew']),
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
    budget: v.optional(validInputNumber),
    settings: v.optional(v.picklist(['limit', 'range'])),
    direction: v.optional(v.picklist(['buy', 'sell'])),
    action: v.optional(v.picklist(['deposit', 'withdraw'])),
  }),
});

export const toRecurringPricesSearch = (
  strategy: Strategy,
  editType: 'editPrices' | 'renew',
): EditRecurringStrategySearch => {
  const { buy, sell } = strategy;
  return {
    editType,
    buyMin: initInput(buy.min),
    buyMax: initInput(buy.max),
    buySettings: buy.min === buy.max ? 'limit' : 'range',
    sellMin: initInput(sell.min),
    sellMax: initInput(sell.max),
    sellSettings: sell.min === sell.max ? 'limit' : 'range',
  };
};
export const editPricesRecurring = createRoute({
  getParentRoute: () => editPrice,
  path: 'recurring',
  component: EditPricesStrategyRecurringPage,
  validateSearch: searchValidator({
    editType: v.picklist(['editPrices', 'renew']),
    buyMin: v.optional(validInputNumber),
    buyMax: v.optional(validInputNumber),
    buyBudget: v.optional(validInputNumber),
    buySettings: v.optional(v.picklist(['limit', 'range'])),
    buyAction: v.optional(v.picklist(['deposit', 'withdraw'])),
    sellMin: v.optional(validInputNumber),
    sellMax: v.optional(validInputNumber),
    sellBudget: v.optional(validInputNumber),
    sellSettings: v.optional(v.picklist(['limit', 'range'])),
    sellAction: v.optional(v.picklist(['deposit', 'withdraw'])),
  }),
});

export const toOverlappingPricesSearch = (
  strategy: Strategy,
  editType: 'editPrices' | 'renew',
): EditOverlappingStrategySearch => {
  const { buy, sell } = strategy;

  // If come from disposable, prevent setting 0
  const lowRates = [buy.min, sell.min].filter((v) => !isZero(v));
  const highRates = [buy.max, sell.max].filter((v) => !isZero(v));
  const min = lowRates.length ? SafeDecimal.min(...lowRates).toString() : '';
  const max = highRates.length ? SafeDecimal.max(...highRates).toString() : '';

  // Do not set spread if the strategy wasn't an overlapping one originally
  const isOverlapping = isOverlappingStrategy(strategy);
  const spread = isOverlapping && getRoundedSpread(strategy);

  return {
    editType,
    min: initInput(min),
    max: initInput(max),
    spread: spread ? spread.toString() : undefined,
  };
};
export const editPricesOverlapping = createRoute({
  getParentRoute: () => editPrice,
  path: 'overlapping',
  component: EditPricesOverlappingPage,
  validateSearch: searchValidator({
    editType: v.picklist(['editPrices', 'renew']),
    chartType: v.optional(v.picklist(['history', 'range'])),
    marketPrice: v.optional(validNumber),
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
    spread: v.optional(validNumber),
    budget: v.optional(validNumber),
    anchor: v.optional(v.picklist(['buy', 'sell'])),
    action: v.optional(v.picklist(['deposit', 'withdraw'])),
  }),
});

// BUDGET
export const editBudgetDisposable = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/disposable',
  component: EditBudgetDisposablePage,
  validateSearch: searchValidator({
    editType: v.picklist(['deposit', 'withdraw']),
    buyBudget: v.optional(validNumber),
    sellBudget: v.optional(validNumber),
    buyMarginalPrice: v.optional(validMarginalPrice),
    sellMarginalPrice: v.optional(validMarginalPrice),
  }),
});

export const editBudgetRecurring = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/recurring',
  component: EditBudgetRecurringPage,
  validateSearch: searchValidator({
    editType: v.picklist(['deposit', 'withdraw']),
    buyBudget: v.optional(validNumber),
    buyMarginalPrice: v.optional(validMarginalPrice),
    sellBudget: v.optional(validNumber),
    sellMarginalPrice: v.optional(validMarginalPrice),
  }),
});

export const editBudgetOverlapping = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/overlapping',
  component: EditBudgetOverlappingPage,
  validateSearch: searchValidator({
    editType: v.picklist(['deposit', 'withdraw']),
    chartType: v.optional(v.picklist(['history', 'range'])),
    marketPrice: v.optional(validNumber),
    budget: v.optional(validNumber),
    anchor: v.optional(v.picklist(['buy', 'sell'])),
  }),
});
