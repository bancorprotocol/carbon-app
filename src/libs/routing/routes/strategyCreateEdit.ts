import { Route } from '@tanstack/react-router';
import { rootRoot } from 'libs/routing/routes/root';
import { CreateStrategyPage } from 'pages/strategies/create';
import { EditStrategyPage } from 'pages/strategies/edit';

export const createStrategyPage = new Route({
  getParentRoute: () => rootRoot,
  path: '/strategies/create',
  component: CreateStrategyPage,
  validateSearch: (search: Record<string, unknown>) => {
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

export const editStrategyPage = new Route({
  getParentRoute: () => rootRoot,
  path: '/strategies/edit/$strategyId',
  component: EditStrategyPage,
});
