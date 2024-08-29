import { Route, redirect } from '@tanstack/react-router';
import { validateActivityParams } from 'components/activity/utils';
import { rootRoute } from 'libs/routing/routes/root';
import { StrategiesPage } from 'pages/strategies';
import { StrategiesActivityPage } from 'pages/strategies/activity';
import { StrategiesOverviewPage } from 'pages/strategies/overview';
import { StrategiesPortfolioPage } from 'pages/strategies/portfolio';
import { StrategiesPortfolioTokenPage } from 'pages/strategies/portfolio/token';
import { validString, validateSearchParams } from '../utils';
import { MyStrategiesSearch } from 'hooks/useStrategies';

export const myStrategyLayout = new Route({
  getParentRoute: () => rootRoute,
  id: 'my-strategy-layout',
  component: StrategiesPage,
});

export const strategyOverviewPage = new Route({
  getParentRoute: () => myStrategyLayout,
  path: '/',
  component: StrategiesOverviewPage,
  validateSearch: validateSearchParams<MyStrategiesSearch>({
    search: validString,
  }),
  postSearchFilters: [
    (search: MyStrategiesSearch) => {
      if (!search.search) delete search.search;
      return search;
    },
  ],
});

export const strategyPortfolioLayout = new Route({
  getParentRoute: () => myStrategyLayout,
  path: 'strategies/portfolio',
});

export const strategyPortfolioPage = new Route({
  getParentRoute: () => strategyPortfolioLayout,
  path: '/',
  component: StrategiesPortfolioPage,
});

export const strategyPortfolioTokenPage = new Route({
  getParentRoute: () => strategyPortfolioLayout,
  path: 'token/$address',
  component: StrategiesPortfolioTokenPage,
});

export const strategyActivityPage = new Route({
  getParentRoute: () => myStrategyLayout,
  path: 'strategies/activity',
  component: StrategiesActivityPage,
  validateSearch: validateActivityParams,
});

// REDIRECT
export const oldCreateStrategies = new Route({
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
