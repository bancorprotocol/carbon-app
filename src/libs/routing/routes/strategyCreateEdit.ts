import { Route } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
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
  buyMin?: string;
  buyMax?: string;
  buyBudget?: string;
  sellMin?: string;
  sellMax?: string;
  sellBudget?: string;
}

const createParamsKeys: (keyof StrategyCreateSearch)[] = [
  'base',
  'quote',
  'strategyType',
  'strategyDirection',
  'strategySettings',
  'buyMin',
  'buyMax',
  'buyBudget',
  'sellMin',
  'sellMax',
  'sellBudget',
];

export const createStrategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/create',
  component: CreateStrategyPage,
  validateSearch: (search: Record<string, unknown>): StrategyCreateSearch => {
    for (const key in search) {
      if (!createParamsKeys.includes(key as keyof StrategyCreateSearch)) {
        delete search[key];
      }
    }
    return search;
  },
});

export type EditTypes = 'renew' | 'editPrices' | 'deposit' | 'withdraw';

export interface EditStratgySearch {
  type: EditTypes;
}

export const editStrategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/strategies/edit/$strategyId',
  component: EditStrategyPage,
  validateSearch: (search: Record<string, unknown>): EditStratgySearch => {
    return { type: search.type as EditTypes };
  },
});
