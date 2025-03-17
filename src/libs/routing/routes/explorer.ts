import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { ExplorerPage } from 'pages/explorer';
import { ExplorerActivityPage } from 'pages/explorer/type/activity';
import { ExplorerTypeOverviewPage } from 'pages/explorer/type/overview';
import { ExplorerTypePortfolioPage } from 'pages/explorer/type/portfolio';
import { ExplorerTypePortfolioTokenPage } from 'pages/explorer/type/portfolio/token';
import { validateActivityParams } from 'components/activity/utils';
import { getLastVisitedPair, searchValidator } from '../utils';
import { toPairSlug } from 'utils/pairSearch';
import * as v from 'valibot';

export const oldTradePairExplorer = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore/token-pair/*',
  beforeLoad: ({ params }) => {
    const allParams = (params as any)['*'];
    redirect({
      to: `/explore/${allParams}`,
      throw: true,
      replace: true,
    } as any);
  },
});
export const oldWalletExplorer = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore/wallet/*',
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
  beforeLoad: ({ location }) => {
    if (location.pathname === '/explore' || location.pathname === '/explore/') {
      const { base, quote } = getLastVisitedPair();
      const slug = toPairSlug({ address: base }, { address: quote });
      redirect({
        to: '/explore/$slug',
        params: { slug },
        throw: true,
        replace: true,
      });
    }
  },
});

export const explorerResultLayout = createRoute({
  getParentRoute: () => explorerLayout,
  path: '$slug',
  component: ExplorerPage,
});

export const explorerOverviewPage = createRoute({
  getParentRoute: () => explorerResultLayout,
  path: '/',
  component: ExplorerTypeOverviewPage,
  validateSearch: searchValidator({
    layout: v.optional(v.picklist(['grid', 'table'])),
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
