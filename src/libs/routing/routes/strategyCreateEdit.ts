import { Route } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { EditStrategyPage } from 'pages/strategies/edit';
import {
  validAddress,
  validLiteral,
  validNumber,
  validateSearchParams,
} from 'libs/routing/utils';
import { CreateStrategyTokenPage } from 'pages/strategies/create/token';
import {
  CreateDisposableStrategyPage,
  CreateDisposableStrategySearch,
} from 'pages/strategies/create/disposable';
import { StrategyTypeId } from 'components/strategies/create/strategyTypeItems';
import {
  CreateRecurringStrategyPage,
  CreateRecurringStrategySearch,
} from 'pages/strategies/create/recurring';
import {
  CreateOverlappingStrategyPage,
  CreateOverlappingStrategySearch,
} from 'pages/strategies/create/overlapping';

export type StrategyType = 'recurring' | 'disposable';
export type StrategyDirection = 'buy' | 'sell';

export type LimitRange = 'limit' | 'range';
export type StrategySettings = LimitRange | 'overlapping';

// TODO: Remove when everything has been migrated
export interface StrategyCreateSearch {
  base?: string;
  quote?: string;
  strategyType?: StrategyType;
  strategyDirection?: StrategyDirection;
  strategySettings?: StrategySettings;
  buyMin?: string;
  buyMax?: string;
  buyBudget?: string;
  sellMin?: string;
  sellMax?: string;
  sellBudget?: string;
}

export interface CreateSelectToken {
  base?: string;
  quote?: string;
  strategyTypeId?: StrategyTypeId;
}

export const createStrategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/create',
  component: CreateStrategyTokenPage,
  validateSearch: validateSearchParams<CreateSelectToken>({
    base: validAddress,
    quote: validAddress,
    strategyTypeId: validLiteral([
      'buy-limit',
      'range-order',
      'two-ranges',
      'overlapping',
    ]),
  }),
});

export const createDisposableStrategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/create/disposable',
  component: CreateDisposableStrategyPage,
  validateSearch: validateSearchParams<CreateDisposableStrategySearch>({
    base: validAddress,
    quote: validAddress,
    direction: validLiteral(['buy', 'sell']),
    settings: validLiteral(['limit', 'range']),
    min: validNumber,
    max: validNumber,
    budget: validNumber,
  }),
});

export const createRecurringStrategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/create/recurring',
  component: CreateRecurringStrategyPage,
  validateSearch: validateSearchParams<CreateRecurringStrategySearch>({
    base: validAddress,
    quote: validAddress,
    buyMin: validNumber,
    buyMax: validNumber,
    buyBudget: validNumber,
    buySettings: validLiteral(['limit', 'range']),
    sellMin: validNumber,
    sellMax: validNumber,
    sellBudget: validNumber,
    sellSettings: validLiteral(['limit', 'range']),
  }),
});

export const createOverlappingStrategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/create/overlapping',
  component: CreateOverlappingStrategyPage,
  validateSearch: validateSearchParams<CreateOverlappingStrategySearch>({
    base: validAddress,
    quote: validAddress,
    marketPrice: validNumber,
    min: validNumber,
    max: validNumber,
    spread: validNumber,
    budget: validNumber,
    anchor: validLiteral(['buy', 'sell']),
  }),
});

export type EditTypes = 'renew' | 'editPrices' | 'deposit' | 'withdraw';

export interface EditStrategySearch {
  type: EditTypes;
}
export const editStrategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/edit/$strategyId',
  component: EditStrategyPage,
  validateSearch: validateSearchParams<EditStrategySearch>({
    type: validLiteral(['renew', 'editPrices', 'deposit', 'withdraw']),
  }),
});
