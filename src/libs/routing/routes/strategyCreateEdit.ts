import { Route } from '@tanstack/react-router';
import { rootRoot } from 'libs/routing/routes/root';
import { CreateStrategyPage } from 'pages/strategies/create';
import { EditStrategyPage } from 'pages/strategies/edit';

export type StrategyType = 'recurring' | 'disposable';
export type StrategyDirection = 'buy' | 'sell';

export type LimitRange = 'limit' | 'range';
export type StrategySettings = LimitRange | 'overlapping';

export interface StrategyCreateSearch {
  base?: string;
  quote?: string;
  strategyType?: StrategyType;
  strategyDirection?: StrategyDirection;
  strategySettings?: StrategySettings;
  strategy?: string;
}

export const createStrategyPage = new Route({
  getParentRoute: () => rootRoot,
  path: '/strategies/create',
  component: CreateStrategyPage,
  validateSearch: (search: Record<string, unknown>): StrategyCreateSearch => {
    if (
      search.strategyType === 'recurring' ||
      search.strategyType === 'disposable' ||
      search.strategy
    ) {
      return search;
    }
    return { ...search, strategyType: 'recurring' };
  },
});

export type EditTypes = 'renew' | 'editPrices' | 'deposit' | 'withdraw';

export interface EditStratgySearch {
  type: EditTypes;
}

export const editStrategyPage = new Route({
  getParentRoute: () => rootRoot,
  path: '/strategies/edit/$strategyId',
  component: EditStrategyPage,
  validateSearch: (search: Record<string, unknown>): EditStratgySearch => {
    return { type: search.type as EditTypes };
  },
});
