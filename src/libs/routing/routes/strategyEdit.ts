import { Route } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import {
  validLiteral,
  validMarginalPrice,
  validNumber,
  validateSearchParams,
} from '../utils';
import { EditStrategyPageLayout } from 'pages/strategies/edit/layout';
import {
  EditStrategyRecurringPage,
  EditRecurringStrategySearch,
} from 'pages/strategies/edit/prices/recurring';
import { Strategy } from 'libs/queries';
import { isEmptyOrder, isZero } from 'components/strategies/common/utils';
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

export type EditTypes = 'renew' | 'editPrices' | 'deposit' | 'withdraw';

export const editStrategyLayout = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/edit/$strategyId',
  component: EditStrategyPageLayout,
  validateSearch: (search: { editType: EditTypes }) => search,
});

// PRICES
const initInput = (value: string) => {
  if (isZero(value)) return '';
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
export const editPricesDisposable = new Route({
  getParentRoute: () => editStrategyLayout,
  path: 'prices/disposable',
  component: EditStrategyDisposablePage,
  validateSearch: validateSearchParams<EditDisposableStrategySearch>({
    editType: validLiteral(['editPrices', 'renew']),
    min: validNumber,
    max: validNumber,
    budget: validNumber,
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
export const editPricesRecurring = new Route({
  getParentRoute: () => editStrategyLayout,
  path: 'prices/recurring',
  component: EditStrategyRecurringPage,
  validateSearch: validateSearchParams<EditRecurringStrategySearch>({
    editType: validLiteral(['editPrices', 'renew']),
    buyMin: validNumber,
    buyMax: validNumber,
    buyBudget: validNumber,
    buySettings: validLiteral(['limit', 'range']),
    buyAction: validLiteral(['deposit', 'withdraw']),
    sellMin: validNumber,
    sellMax: validNumber,
    sellBudget: validNumber,
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
  const startRates = [buy.startRate, sell.startRate].filter((v) => !isZero(v));
  const endRates = [buy.endRate, sell.endRate].filter((v) => !isZero(v));
  const min = SafeDecimal.min(...startRates).toString();
  const max = SafeDecimal.max(...endRates).toString();

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
export const editPricesOverlapping = new Route({
  getParentRoute: () => editStrategyLayout,
  path: 'prices/overlapping',
  component: EditStrategyOverlappingPage,
  validateSearch: validateSearchParams<EditOverlappingStrategySearch>({
    editType: validLiteral(['editPrices', 'renew']),
    marketPrice: validNumber,
    min: validNumber,
    max: validNumber,
    spread: validNumber,
    budget: validNumber,
    anchor: validLiteral(['buy', 'sell']),
    action: validLiteral(['deposit', 'withdraw']),
  }),
});

// BUDGET
export const editBudgetDisposable = new Route({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/disposable',
  component: EditBudgetDisposablePage,
  validateSearch: validateSearchParams<EditBudgetDisposableStrategySearch>({
    editType: validLiteral(['deposit', 'withdraw']),
    buyBudget: validNumber,
    sellBudget: validNumber,
    marginalPrice: validMarginalPrice,
  }),
});

export const editBudgetRecurring = new Route({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/recurring',
  component: EditBudgetRecurringPage,
  validateSearch: validateSearchParams<EditBudgetRecurringStrategySearch>({
    editType: validLiteral(['deposit', 'withdraw']),
    buyBudget: validNumber,
    buyMarginalPrice: validMarginalPrice,
    sellBudget: validNumber,
    sellMarginalPrice: validMarginalPrice,
  }),
});

export const editBudgetOverlapping = new Route({
  getParentRoute: () => editStrategyLayout,
  path: 'budget/overlapping',
  component: EditBudgetOverlappingPage,
  validateSearch: validateSearchParams<EditBudgetOverlappingSearch>({
    editType: validLiteral(['deposit', 'withdraw']),
    marketPrice: validNumber,
    budget: validNumber,
    anchor: validLiteral(['buy', 'sell']),
  }),
});
