import { createRoute, redirect } from '@tanstack/react-router';
import { validateActivityParams } from 'components/activity/utils';
import { rootRoute } from 'libs/routing/routes/root';
import { StrategiesPage } from 'pages/strategies';
import { StrategiesActivityPage } from 'pages/strategies/activity';
import { StrategiesOverviewPage } from 'pages/strategies/overview';
import { StrategiesPortfolioPage } from 'pages/strategies/portfolio';
import { StrategiesPortfolioTokenPage } from 'pages/strategies/portfolio/token';
import { searchValidator, validString } from '../utils';
import { MyStrategiesSearch } from 'hooks/useStrategies';
import * as v from 'valibot';

export const myStrategyLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio',
  component: StrategiesPage,
});

export const strategyOverviewPage = createRoute({
  getParentRoute: () => myStrategyLayout,
  path: '/',
  component: StrategiesOverviewPage,
  validateSearch: searchValidator({
    search: v.optional(validString),
    layout: v.optional(v.picklist(['grid', 'table'])),
  }),
  postSearchFilters: [
    (search: MyStrategiesSearch) => {
      if (!search.search) delete search.search;
      return search;
    },
  ],
});

export const strategyPortfolioLayout = createRoute({
  getParentRoute: () => myStrategyLayout,
  path: 'strategies/portfolio',
});

export const strategyPortfolioPage = createRoute({
  getParentRoute: () => strategyPortfolioLayout,
  path: '/',
  component: StrategiesPortfolioPage,
});

export const strategyPortfolioTokenPage = createRoute({
  getParentRoute: () => strategyPortfolioLayout,
  path: 'token/$address',
  component: StrategiesPortfolioTokenPage,
});

export const strategyActivityPage = createRoute({
  getParentRoute: () => myStrategyLayout,
  path: 'strategies/activity',
  component: StrategiesActivityPage,
  validateSearch: validateActivityParams,
});

// REDIRECT
export const oldCreateStrategies = createRoute({
  getParentRoute: () => rootRoute,
  path: '/strategies/create/*',
  beforeLoad: ({ location, params }) => {
    const allParams = (params as any)['*'];
    redirect({
      to: `/trade/${allParams}`,
      search: location.search,
      throw: true,
      replace: true,
    } as any);
  },
});
