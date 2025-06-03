import { createRoute } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  searchValidator,
  validMarginalPrice,
  validNumber,
  validInputNumber,
} from '../utils';
import { EditStrategyPageLayout } from 'pages/strategies/edit/layout';
import {
  EditPricesStrategyRecurringPage,
  EditRecurringStrategySearch,
} from 'pages/strategies/edit/prices/recurring';
import { Strategy } from 'libs/queries';
import { isEmptyOrder, isZero } from 'components/strategies/common/utils';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import { isOverlappingStrategy } from 'components/strategies/common/utils';
import {
  EditDisposableStrategySearch,
  EditPricesStrategyDisposablePage,
} from 'pages/strategies/edit/prices/disposable';
import {
  EditOverlappingStrategySearch,
  EditPricesOverlappingPage,
} from 'pages/strategies/edit/prices/overlapping';
import { EditBudgetRecurringPage } from 'pages/strategies/edit/budget/recurring';
import { EditBudgetDisposablePage } from 'pages/strategies/edit/budget/disposable';
import { EditBudgetOverlappingPage } from 'pages/strategies/edit/budget/overlapping';
import { SafeDecimal } from 'libs/safedecimal';
import * as v from 'valibot';

export type EditTypes = 'renew' | 'editPrices' | 'deposit' | 'withdraw';

export const editStrategyLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/strategies/edit/$strategyId',
  component: EditStrategyPageLayout,
  validateSearch: searchValidator({
    priceStart: v.optional(validNumber),
    priceEnd: v.optional(validNumber),
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
  const { order0, order1 } = strategy;
  const direction = isEmptyOrder(order0) ? 'sell' : 'buy';
  const order = direction === 'sell' ? order1 : order0;
  return {
    editType,
    min: initInput(order.startRate),
    max: initInput(order.endRate),
    settings: order.startRate === order.endRate ? 'limit' : 'range',
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
  const { order0: buy, order1: sell } = strategy;
  return {
    editType,
    buyMin: initInput(buy.startRate),
    buyMax: initInput(buy.endRate),
    buySettings: buy.startRate === buy.endRate ? 'limit' : 'range',
    sellMin: initInput(sell.startRate),
    sellMax: initInput(sell.endRate),
    sellSettings: sell.startRate === sell.endRate ? 'limit' : 'range',
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
  const { order0: buy, order1: sell } = strategy;

  // If come from disposable, prevent setting 0
  const lowRates = [buy.startRate, sell.startRate].filter((v) => !isZero(v));
  const highRates = [buy.endRate, sell.endRate].filter((v) => !isZero(v));
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
