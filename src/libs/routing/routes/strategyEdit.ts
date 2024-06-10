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
import { roundSearchParam } from 'utils/helpers';
import { isEmptyOrder } from 'components/strategies/common/utils';
import {
  getRoundedSpread,
  isOverlappingStrategy,
} from 'components/strategies/overlapping/utils';
import {
  EditDisposableStrategySearch,
  EditStrategyDisposablePage,
} from 'pages/strategies/edit/prices/disposable';
import {
  EditOverlappingStrategySearch,
  EditStrategyOverlappingPage,
} from 'pages/strategies/edit/prices/overlapping';
import { EditPriceLayoutPage } from 'pages/strategies/edit/prices/layout';
import {
  EditBudgetRecurringPage,
  EditBudgetRecurringStrategySearch,
} from 'pages/strategies/edit/budget/recurring';
import { EditBudgetLayoutPage } from 'pages/strategies/edit/budget/layout';
import {
  EditBudgetDisposablePage,
  EditBudgetDisposableStrategySearch,
} from 'pages/strategies/edit/budget/disposable';
import {
  EditBudgetOverlappingPage,
  EditBudgetOverlappingSearch,
} from 'pages/strategies/edit/budget/overlapping';

export type EditTypes = 'renew' | 'editPrices' | 'deposit' | 'withdraw';

export interface EditStrategySearch {
  type: EditTypes;
}
// TODO: support old urls
// export const editStrategyPage = new Route({
//   getParentRoute: () => rootRoute,
//   path: '/strategies/edit/$strategyId',
//   component: EditStrategyPage,
//   validateSearch: validateSearchParams<EditStrategySearch>({
//     type: validLiteral(['renew', 'editPrices', 'deposit', 'withdraw']),
//   }),
// });

export const editStrategyLayout = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/edit/$strategyId',
  component: EditStrategyPageLayout,
});

// PRICES

export const editPricesLayout = new Route({
  getParentRoute: () => editStrategyLayout,
  path: 'prices',
  component: EditPriceLayoutPage,
  validateSearch: (search: { type: 'editPrices' | 'renew' }) => search,
});

export const toDisposablePricesSearch = (
  strategy: Strategy,
  type: 'editPrices' | 'renew'
): EditDisposableStrategySearch => {
  const { order0, order1 } = strategy;
  const direction = isEmptyOrder(order0) ? 'sell' : 'buy';
  const order = direction === 'sell' ? order1 : order0;
  return {
    type,
    min: roundSearchParam(order.startRate),
    max: roundSearchParam(order.endRate),
    settings: order.startRate === order.endRate ? 'limit' : 'range',
    direction,
  };
};
export const editPricesDisposable = new Route({
  getParentRoute: () => editPricesLayout,
  path: 'disposable',
  component: EditStrategyDisposablePage,
  validateSearch: validateSearchParams<EditDisposableStrategySearch>({
    type: validLiteral(['editPrices', 'renew']),
    min: validNumber,
    max: validNumber,
    settings: validLiteral(['limit', 'range']),
    direction: validLiteral(['buy', 'sell']),
  }),
});

export const toRecurringPricesSearch = (
  strategy: Strategy,
  type: 'editPrices' | 'renew'
): EditRecurringStrategySearch => {
  const { order0: buy, order1: sell } = strategy;
  return {
    type,
    buyMin: roundSearchParam(buy.startRate),
    buyMax: roundSearchParam(buy.endRate),
    buySettings: buy.startRate === buy.endRate ? 'limit' : 'range',
    sellMin: roundSearchParam(sell.startRate),
    sellMax: roundSearchParam(sell.endRate),
    sellSettings: sell.startRate === sell.endRate ? 'limit' : 'range',
  };
};
export const editPricesRecurring = new Route({
  getParentRoute: () => editPricesLayout,
  path: 'recurring',
  component: EditStrategyRecurringPage,
  validateSearch: validateSearchParams<EditRecurringStrategySearch>({
    type: validLiteral(['editPrices', 'renew']),
    buyMin: validNumber,
    buyMax: validNumber,
    buySettings: validLiteral(['limit', 'range']),
    sellMin: validNumber,
    sellMax: validNumber,
    sellSettings: validLiteral(['limit', 'range']),
  }),
});

export const toOverlappingPricesSearch = (
  strategy: Strategy,
  type: 'editPrices' | 'renew'
): EditOverlappingStrategySearch => {
  const { order0: buy, order1: sell } = strategy;
  const isOverlapping = isOverlappingStrategy(strategy);
  // Do not set spread if the strategy wasn't an overlapping one originally
  const spread = isOverlapping && getRoundedSpread(strategy);
  return {
    type,
    min: roundSearchParam(buy.startRate) || undefined,
    max: roundSearchParam(sell.endRate) || undefined,
    spread: spread ? spread.toString() : undefined,
  };
};
export const editPricesOverlapping = new Route({
  getParentRoute: () => editPricesLayout,
  path: 'overlapping',
  component: EditStrategyOverlappingPage,
  validateSearch: validateSearchParams<EditOverlappingStrategySearch>({
    type: validLiteral(['editPrices', 'renew']),
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

export const editBudgetLayout = new Route({
  getParentRoute: () => editStrategyLayout,
  path: 'budget',
  component: EditBudgetLayoutPage,
  validateSearch: (search: { action: 'deposit' | 'withdraw' }) => search,
});

export const editBudgetDisposable = new Route({
  getParentRoute: () => editBudgetLayout,
  path: 'disposable',
  component: EditBudgetDisposablePage,
  validateSearch: validateSearchParams<EditBudgetDisposableStrategySearch>({
    action: validLiteral(['deposit', 'withdraw']),
    budget: validNumber,
    marginalPrice: validMarginalPrice,
  }),
});

export const editBudgetRecurring = new Route({
  getParentRoute: () => editBudgetLayout,
  path: 'recurring',
  component: EditBudgetRecurringPage,
  validateSearch: validateSearchParams<EditBudgetRecurringStrategySearch>({
    action: validLiteral(['deposit', 'withdraw']),
    buyBudget: validNumber,
    buyMarginalPrice: validMarginalPrice,
    sellBudget: validNumber,
    sellMarginalPrice: validMarginalPrice,
  }),
});

export const editBudgetOverlapping = new Route({
  getParentRoute: () => editBudgetLayout,
  path: 'overlapping',
  component: EditBudgetOverlappingPage,
  validateSearch: validateSearchParams<EditBudgetOverlappingSearch>({
    marketPrice: validNumber,
    budget: validNumber,
    anchor: validLiteral(['buy', 'sell']),
    action: validLiteral(['deposit', 'withdraw']),
  }),
});
