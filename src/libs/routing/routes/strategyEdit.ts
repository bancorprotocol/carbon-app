import { Route } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { validLiteral, validNumber, validateSearchParams } from '../utils';
import { EditStrategyPageLayout } from 'pages/strategies/edit/layout';
import {
  EditStrategyRecurringPage,
  EditRecurringStrategySearch,
} from 'pages/strategies/edit/recurring/prices';
import { Strategy } from 'libs/queries';
import { roundSearchParam } from 'utils/helpers';
import { isEmptyOrder } from 'components/strategies/common/utils';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import {
  EditDisposableStrategySearch,
  EditStrategyDisposablePage,
} from 'pages/strategies/edit/disposable/prices';
import {
  EditOverlappingStrategySearch,
  EditStrategyOverlappingPage,
} from 'pages/strategies/edit/overlapping/prices';

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

export const toDisposablePriceSearch = (
  strategy: Strategy
): EditDisposableStrategySearch => {
  const { order0, order1 } = strategy;
  const direction = isEmptyOrder(order0) ? 'sell' : 'buy';
  const order = direction === 'sell' ? order1 : order0;
  return {
    min: roundSearchParam(order.startRate) || '0',
    max: roundSearchParam(order.endRate) || '0',
    settings: order.startRate === order.endRate ? 'limit' : 'range',
    direction,
  };
};
export const editStrategyDisposablePrices = new Route({
  getParentRoute: () => editStrategyLayout,
  path: '/disposable/prices',
  component: EditStrategyDisposablePage,
  validateSearch: validateSearchParams<EditDisposableStrategySearch>({
    min: validNumber,
    max: validNumber,
    settings: validLiteral(['limit', 'range']),
    direction: validLiteral(['buy', 'sell']),
  }),
});

export const toRecurringPriceSearch = (
  strategy: Strategy
): EditRecurringStrategySearch => {
  const { order0: buy, order1: sell } = strategy;
  return {
    buyMin: roundSearchParam(buy.startRate) || '0',
    buyMax: roundSearchParam(buy.endRate) || '0',
    buySettings: buy.startRate === buy.endRate ? 'limit' : 'range',
    sellMin: roundSearchParam(sell.startRate) || '0',
    sellMax: roundSearchParam(sell.endRate) || '0',
    sellSettings: sell.startRate === sell.endRate ? 'limit' : 'range',
  };
};
export const editStrategyRecurringPrices = new Route({
  getParentRoute: () => editStrategyLayout,
  path: '/recurring/prices',
  component: EditStrategyRecurringPage,
  validateSearch: validateSearchParams<EditRecurringStrategySearch>({
    buyMin: validNumber,
    buyMax: validNumber,
    buySettings: validLiteral(['limit', 'range']),
    sellMin: validNumber,
    sellMax: validNumber,
    sellSettings: validLiteral(['limit', 'range']),
  }),
});

export const toOverlappingPriceSearch = (
  strategy: Strategy
): EditOverlappingStrategySearch => {
  const { order0: buy, order1: sell } = strategy;
  return {
    min: roundSearchParam(buy.startRate) || '0',
    max: roundSearchParam(sell.endRate) || '0',
    spread: getRoundedSpread(strategy).toString(),
  };
};
export const editStrategyOverlappingPrices = new Route({
  getParentRoute: () => editStrategyLayout,
  path: '/overlapping/prices',
  component: EditStrategyOverlappingPage,
  validateSearch: validateSearchParams<EditOverlappingStrategySearch>({
    min: validNumber,
    max: validNumber,
    spread: validNumber,
    budget: validNumber,
    anchor: validLiteral(['buy', 'sell']),
  }),
});
