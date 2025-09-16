import { createRoute, redirect } from '@tanstack/react-router';
import { validateActivityParams } from 'components/activity/utils';
import { rootRoute } from 'libs/routing/routes/root';
import { PortfolioLayout } from 'pages/strategies/layout';
import { PortfolioActivityPage } from 'pages/strategies/activity';
import { PortfolioStrategiesPage } from 'pages/strategies/strategies';
import { PortfolioDistributionPage } from 'pages/strategies/portfolio';
import { PortfolioDistributionTokenPage } from 'pages/strategies/portfolio/token';
import { searchValidator, validString } from '../utils';
import * as v from 'valibot';
import { PorfolioPairsPage } from 'pages/strategies/pairs';

export const portfolioLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio',
  component: PortfolioLayout,
  validateSearch: searchValidator({
    search: v.optional(validString),
  }),
  beforeLoad: ({ location }) => {
    const ends = ['/portfolio', '/portfolio/'];
    for (const end of ends) {
      if (location.pathname.endsWith(end)) {
        throw redirect({
          to: `/portfolio/pairs${location.searchStr}`,
          replace: true,
        } as any);
      }
    }
  },
});

export const portfolioPairsPage = createRoute({
  getParentRoute: () => portfolioLayout,
  path: 'pairs',
  component: PorfolioPairsPage,
  validateSearch: searchValidator({
    layout: v.optional(v.picklist(['grid', 'table'])),
  }),
});

export const portfolioStrategiesPage = createRoute({
  getParentRoute: () => portfolioLayout,
  path: 'strategies',
  component: PortfolioStrategiesPage,
  validateSearch: searchValidator({
    layout: v.optional(v.picklist(['grid', 'table'])),
  }),
});

// TODO: add redirect for old urls

export const portfolioDistributionPage = createRoute({
  getParentRoute: () => portfolioLayout,
  path: 'distribution',
  component: PortfolioDistributionPage,
});

export const portfolioDistributionTokenPage = createRoute({
  getParentRoute: () => portfolioLayout,
  path: 'distribution/token/$address',
  component: PortfolioDistributionTokenPage,
});

export const portfolioActivityPage = createRoute({
  getParentRoute: () => portfolioLayout,
  path: 'activity',
  component: PortfolioActivityPage,
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
