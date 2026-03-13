import { createRoute } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  searchValidator,
  validMarginalPrice,
  validNumber,
  validInputNumber,
  validSettings,
  validAction,
  validDirection,
  validChartType,
} from '../utils';
import { EditStrategyRoot } from 'pages/portfolio/edit/root';
import { EditPricesStrategyRecurringPage } from 'pages/portfolio/edit/prices/recurring';
import { EditPricesStrategyDisposablePage } from 'pages/portfolio/edit/prices/disposable';
import { EditPricesOverlappingPage } from 'pages/portfolio/edit/prices/overlapping';
import { EditBudgetRecurringPage } from 'pages/portfolio/edit/budget/recurring';
import { EditBudgetDisposablePage } from 'pages/portfolio/edit/budget/disposable';
import { EditBudgetOverlappingPage } from 'pages/portfolio/edit/budget/overlapping';
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
export const editPrice = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'prices',
  validateSearch: searchValidator({
    marketPrice: v.optional(validNumber),
  }),
});

export type EditPriceDisposableSearch =
  (typeof editPricesDisposable)['types']['searchSchema'];
export const editPricesDisposable = createRoute({
  getParentRoute: () => editPrice,
  path: 'disposable',
  component: EditPricesStrategyDisposablePage,
  validateSearch: searchValidator({
    editType: v.picklist(['editPrices', 'renew']),
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
    presetMin: v.optional(validNumber),
    presetMax: v.optional(validNumber),
    budget: v.optional(validInputNumber),
    settings: v.optional(validSettings),
    direction: v.optional(validDirection),
    action: v.optional(validAction),
  }),
});

export type EditPriceRecurringSearch =
  (typeof editPricesRecurring)['types']['searchSchema'];
export const editPricesRecurring = createRoute({
  getParentRoute: () => editPrice,
  path: 'recurring',
  component: EditPricesStrategyRecurringPage,
  validateSearch: searchValidator({
    editType: v.picklist(['editPrices', 'renew']),
    buyMin: v.optional(validInputNumber),
    buyMax: v.optional(validInputNumber),
    buyPresetMin: v.optional(validNumber),
    buyPresetMax: v.optional(validNumber),
    buyBudget: v.optional(validInputNumber),
    buySettings: v.optional(validSettings),
    buyAction: v.optional(validAction),
    sellMin: v.optional(validInputNumber),
    sellMax: v.optional(validInputNumber),
    sellPresetMin: v.optional(validNumber),
    sellPresetMax: v.optional(validNumber),
    sellBudget: v.optional(validInputNumber),
    sellSettings: v.optional(validSettings),
    sellAction: v.optional(validAction),
  }),
});

export const editPricesOverlapping = createRoute({
  getParentRoute: () => editPrice,
  path: 'overlapping',
  component: EditPricesOverlappingPage,
  validateSearch: searchValidator({
    editType: v.picklist(['editPrices', 'renew']),
    chartType: v.optional(validChartType),
    marketPrice: v.optional(validNumber),
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
    preset: v.optional(validNumber),
    spread: v.optional(validNumber),
    budget: v.optional(validNumber),
    anchor: v.optional(validDirection),
    action: v.optional(validAction),
    // @deprecated March 2026
    fullRange: v.optional(v.boolean()),
  }),
});

// BUDGET
export const editBudgetDisposable = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/disposable',
  component: EditBudgetDisposablePage,
  validateSearch: searchValidator({
    editType: validAction,
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
    editType: validAction,
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
    editType: validAction,
    chartType: v.optional(validChartType),
    marketPrice: v.optional(validNumber),
    budget: v.optional(validNumber),
    anchor: v.optional(validDirection),
  }),
});
