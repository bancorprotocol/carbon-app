import { createRoute, redirect } from '@tanstack/react-router';
import { ExplorerType } from 'components/explorer/utils';
import { rootRoute } from 'libs/routing/routes/root';
import { ExplorerPage } from 'pages/explorer';
import { ExplorerTypePage } from 'pages/explorer/type';
import { ExplorerActivityPage } from 'pages/explorer/type/activity';
import { ExplorerTypeOverviewPage } from 'pages/explorer/type/overview';
import { ExplorerTypePortfolioPage } from 'pages/explorer/type/portfolio';
import { ExplorerTypePortfolioTokenPage } from 'pages/explorer/type/portfolio/token';
import { validateActivityParams } from 'components/activity/utils';
import { getLastVisitedPair, searchValidator } from '../utils';
import { toPairSlug } from 'utils/pairSearch';
import * as v from 'valibot';

// Used for redirecting old explorer route to new explorer route
// TODO: remove this on May 2024
export const oldExplorerLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explorer/*',
  beforeLoad: ({ params }) => {
    const allParams = (params as any)['*'];
    redirect({
      to: `/explore/${allParams}`,
      throw: true,
      replace: true,
    } as any);
  },
});

export const explorerLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
});

export const explorerRedirect = createRoute({
  getParentRoute: () => explorerLayout,
  path: '/',
  beforeLoad: () => {
    const { base, quote } = getLastVisitedPair();
    const slug = toPairSlug({ address: base }, { address: quote });
    redirect({
      to: '/explore/$type/$slug',
      params: { type: 'token-pair', slug },
      throw: true,
      replace: true,
    });
  },
});

export const explorerPage = createRoute({
  getParentRoute: () => explorerLayout,
  path: '$type',
  component: ExplorerPage,
  parseParams: (params: Record<string, string>) => {
    return { type: params.type as ExplorerType };
  },
  beforeLoad: ({ location }) => {
    if (location.pathname.endsWith('token-pair')) {
      const { base, quote } = getLastVisitedPair();
      const slug = toPairSlug({ address: base }, { address: quote });
      redirect({
        to: '/explore/$type/$slug',
        params: { type: 'token-pair', slug },
        throw: true,
        replace: true,
      });
    }
  },
});

export const explorerTypePage = createRoute({
  getParentRoute: () => explorerPage,
  path: '/',
  component: ExplorerTypePage,
});

export const explorerResultLayout = createRoute({
  getParentRoute: () => explorerPage,
  path: '$slug',
});

export const explorerOverviewPage = createRoute({
  getParentRoute: () => explorerResultLayout,
  path: '/',
  component: ExplorerTypeOverviewPage,
  validateSearch: searchValidator({
    layout: v.optional(v.picklist(['list', 'table'])),
  }),
});

export const explorerPortfolioLayout = createRoute({
  getParentRoute: () => explorerResultLayout,
  path: 'portfolio',
});

export const explorerPortfolioPage = createRoute({
  getParentRoute: () => explorerPortfolioLayout,
  path: '/',
  component: ExplorerTypePortfolioPage,
});

export const explorerPortfolioTokenPage = createRoute({
  getParentRoute: () => explorerPortfolioLayout,
  path: 'token/$address',
  component: ExplorerTypePortfolioTokenPage,
});

export const explorerActivityPage = createRoute({
  getParentRoute: () => explorerResultLayout,
  path: '/activity',
  component: ExplorerActivityPage,
  validateSearch: validateActivityParams,
});
