import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { ExplorerLayout } from 'pages/explorer/layout';
import { ExplorerActivityPage } from 'pages/explorer/activity';
import { ExplorerStrategies } from 'pages/explorer/strategies';
import { ExplorerDistribution } from 'pages/explorer/distribution';
import { ExplorerTypePortfolioTokenPage } from 'pages/explorer/distribution/token';
import { validateActivityParams } from 'components/activity/utils';
import { searchValidator } from '../utils';
import { ExplorerPairs } from 'pages/explorer/pairs';
import * as v from 'valibot';

// TODO: implement a redirect
// export const oldExplorer = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/explore/$slug',
//   beforeLoad: ({ params }) => {
//     const allParams = (params as any)['*'];
//     redirect({
//       to: `/explore/${allParams}`,
//       throw: true,
//       replace: true,
//     } as any);
//   },
// });

export const explorerLayout = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorerLayout,
  validateSearch: searchValidator({
    search: v.optional(v.string()),
  }),
  beforeLoad: ({ location }) => {
    const ends = ['/explore', '/explore/'];
    for (const end of ends) {
      if (location.pathname.endsWith(end)) {
        throw redirect({
          to: `/explore/pairs${location.searchStr}`,
          replace: true,
        } as any);
      }
    }
  },
});

export const explorerPortfolioPage = createRoute({
  getParentRoute: () => explorerLayout,
  path: 'strategies',
  component: ExplorerStrategies,
  validateSearch: searchValidator({
    layout: v.optional(v.picklist(['grid', 'table'])),
  }),
});

export const explorerPairsPage = createRoute({
  getParentRoute: () => explorerLayout,
  path: 'pairs',
  component: ExplorerPairs,
});

export const explorerDistributionPage = createRoute({
  getParentRoute: () => explorerLayout,
  path: 'distribution',
  component: ExplorerDistribution,
});

export const explorerDistributionTokenPage = createRoute({
  getParentRoute: () => explorerLayout,
  path: 'distribution/token/$address',
  component: ExplorerTypePortfolioTokenPage,
});

export const explorerActivityPage = createRoute({
  getParentRoute: () => explorerLayout,
  path: '/activity',
  component: ExplorerActivityPage,
  validateSearch: validateActivityParams,
});
