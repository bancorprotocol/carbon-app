import { createRoute } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  validLiteral,
  validMarginalPrice,
  validNumber,
  validPositiveNumber,
  validateSearchParams,
} from '../utils';
import { EditStrategyPageLayout } from 'pages/strategies/edit/layout';
import {
  EditStrategyRecurringPage,
  EditRecurringStrategySearch,
} from 'pages/strategies/edit/prices/recurring';
import { Strategy } from 'libs/queries';
import {
  defaultEnd,
  defaultStart,
  isEmptyOrder,
  isZero,
} from 'components/strategies/common/utils';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import { isOverlappingStrategy } from 'components/strategies/common/utils';
import {
  EditDisposableStrategySearch,
  EditStrategyDisposablePage,
} from 'pages/strategies/edit/prices/disposable';
import {
  EditOverlappingStrategySearch,
  EditStrategyOverlappingPage,
} from 'pages/strategies/edit/prices/overlapping';
import {
  EditBudgetRecurringPage,
  EditBudgetRecurringStrategySearch,
} from 'pages/strategies/edit/budget/recurring';
import {
  EditBudgetDisposablePage,
  EditBudgetDisposableStrategySearch,
} from 'pages/strategies/edit/budget/disposable';
import {
  EditBudgetOverlappingPage,
  EditBudgetOverlappingSearch,
} from 'pages/strategies/edit/budget/overlapping';
import { SafeDecimal } from 'libs/safedecimal';
import * as v from 'valibot';

export type EditTypes = 'renew' | 'editPrices' | 'deposit' | 'withdraw';

export const editStrategyLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/strategies/edit/$strategyId',
  component: EditStrategyPageLayout,
  validateSearch: (search: { editType: EditTypes }) => search,
});

// PRICES
const initInput = (value: string) => {
  if (isZero(value)) return;
  return value;
};

export const toDisposablePricesSearch = (
  strategy: Strategy,
  editType: 'editPrices' | 'renew'
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
export const editPricesDisposable = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'prices/disposable',
  component: EditStrategyDisposablePage,
  beforeLoad: ({ search }) => {
    search.priceStart ||= defaultStart().toString();
    search.priceEnd ||= defaultEnd().toString();
  },
  validateSearch: validateSearchParams<EditDisposableStrategySearch>({
    priceStart: v.optional(validNumber, defaultStart().toString()),
    priceEnd: v.optional(validNumber, defaultEnd().toString()),
    editType: validLiteral(['editPrices', 'renew']),
    min: validPositiveNumber,
    max: validPositiveNumber,
    budget: validPositiveNumber,
    settings: validLiteral(['limit', 'range']),
    direction: validLiteral(['buy', 'sell']),
    action: validLiteral(['deposit', 'withdraw']),
  }),
});

export const toRecurringPricesSearch = (
  strategy: Strategy,
  editType: 'editPrices' | 'renew'
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
  getParentRoute: () => editStrategyLayout,
  path: 'prices/recurring',
  component: EditStrategyRecurringPage,
  beforeLoad: ({ search }) => {
    search.priceStart ||= defaultStart().toString();
    search.priceEnd ||= defaultEnd().toString();
  },
  validateSearch: validateSearchParams<EditRecurringStrategySearch>({
    priceStart: validNumber,
    priceEnd: validNumber,
    editType: validLiteral(['editPrices', 'renew']),
    buyMin: validPositiveNumber,
    buyMax: validPositiveNumber,
    buyBudget: validPositiveNumber,
    buySettings: validLiteral(['limit', 'range']),
    buyAction: validLiteral(['deposit', 'withdraw']),
    sellMin: validPositiveNumber,
    sellMax: validPositiveNumber,
    sellBudget: validPositiveNumber,
    sellSettings: validLiteral(['limit', 'range']),
    sellAction: validLiteral(['deposit', 'withdraw']),
  }),
});

export const toOverlappingPricesSearch = (
  strategy: Strategy,
  editType: 'editPrices' | 'renew'
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
  getParentRoute: () => editStrategyLayout,
  path: 'prices/overlapping',
  component: EditStrategyOverlappingPage,
  beforeLoad: ({ search }) => {
    search.priceStart ||= defaultStart().toString();
    search.priceEnd ||= defaultEnd().toString();
  },
  validateSearch: validateSearchParams<EditOverlappingStrategySearch>({
    priceStart: validNumber,
    priceEnd: validNumber,
    editType: validLiteral(['editPrices', 'renew']),
    chartType: validLiteral(['history', 'range']),
    marketPrice: validNumber,
    min: validPositiveNumber,
    max: validPositiveNumber,
    spread: validNumber,
    budget: validNumber,
    anchor: validLiteral(['buy', 'sell']),
    action: validLiteral(['deposit', 'withdraw']),
  }),
});

// BUDGET
export const editBudgetDisposable = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/disposable',
  component: EditBudgetDisposablePage,
  beforeLoad: ({ search }) => {
    search.priceStart ||= defaultStart().toString();
    search.priceEnd ||= defaultEnd().toString();
  },
  validateSearch: validateSearchParams<EditBudgetDisposableStrategySearch>({
    priceStart: validNumber,
    priceEnd: validNumber,
    editType: validLiteral(['deposit', 'withdraw']),
    buyBudget: validNumber,
    sellBudget: validNumber,
    buyMarginalPrice: validMarginalPrice,
    sellMarginalPrice: validMarginalPrice,
  }),
});

export const editBudgetRecurring = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/recurring',
  component: EditBudgetRecurringPage,
  beforeLoad: ({ search }) => {
    search.priceStart ||= defaultStart().toString();
    search.priceEnd ||= defaultEnd().toString();
  },
  validateSearch: validateSearchParams<EditBudgetRecurringStrategySearch>({
    priceStart: validNumber,
    priceEnd: validNumber,
    editType: validLiteral(['deposit', 'withdraw']),
    buyBudget: validNumber,
    buyMarginalPrice: validMarginalPrice,
    sellBudget: validNumber,
    sellMarginalPrice: validMarginalPrice,
  }),
});

export const editBudgetOverlapping = createRoute({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/overlapping',
  component: EditBudgetOverlappingPage,
  beforeLoad: ({ search }) => {
    search.priceStart ||= defaultStart().toString();
    search.priceEnd ||= defaultEnd().toString();
  },
  validateSearch: validateSearchParams<EditBudgetOverlappingSearch>({
    priceStart: validNumber,
    priceEnd: validNumber,
    editType: validLiteral(['deposit', 'withdraw']),
    chartType: validLiteral(['history', 'range']),
    marketPrice: validNumber,
    budget: validNumber,
    anchor: validLiteral(['buy', 'sell']),
  }),
});
