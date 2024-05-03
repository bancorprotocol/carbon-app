import { Route } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { CreateStrategyPage } from 'pages/strategies/create';
import { EditStrategyPage } from 'pages/strategies/edit';
import {
  validAddress,
  validLiteral,
  validNumber,
  validateSearchParams,
} from 'libs/routing/utils';

export type StrategyType = 'recurring' | 'disposable' | 'overlapping';
export type StrategyDirection = 'buy' | 'sell';

export type LimitRange = 'limit' | 'range';
export type StrategySettings = LimitRange;

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

export const createStrategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/create',
  component: CreateStrategyPage,
  validateSearch: validateSearchParams<StrategyCreateSearch>({
    base: validAddress,
    quote: validAddress,
    strategyType: validLiteral(['recurring', 'disposable', 'overlapping']),
    strategyDirection: validLiteral(['buy', 'sell']),
    strategySettings: validLiteral(['limit', 'range']),
    buyMin: validNumber,
    buyMax: validNumber,
    buyBudget: validNumber,
    sellMin: validNumber,
    sellMax: validNumber,
    sellBudget: validNumber,
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
