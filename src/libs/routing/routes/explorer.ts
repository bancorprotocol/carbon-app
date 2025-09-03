import { createRoute } from '@tanstack/react-router';
import { rootRoute } from 'libs/routing/routes/root';
import { ExplorerPage } from 'pages/explorer/root';
import { ExplorerActivityPage } from 'pages/explorer/activity';
import { ExplorerPortfolio } from 'pages/explorer/portfolio';
import { ExplorerDistribution } from 'pages/explorer/distribution';
import { ExplorerTypePortfolioTokenPage } from 'pages/explorer/distribution/token';
import { validateActivityParams } from 'components/activity/utils';
import { searchValidator } from '../utils';
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
  component: ExplorerPage,
  validateSearch: searchValidator({
    search: v.optional(v.string()),
  }),
});

export const explorerPortfolioPage = createRoute({
  getParentRoute: () => explorerLayout,
  path: 'portfolio',
  component: ExplorerPortfolio,
  validateSearch: searchValidator({
    layout: v.optional(v.picklist(['grid', 'table'])),
  }),
});

export const explorerDistributionPage = createRoute({
  getParentRoute: () => explorerLayout,
  path: 'distribution',
  component: ExplorerDistribution,
});

export const explorerDistributionTokenPage = createRoute({
  getParentRoute: () => explorerDistributionPage,
  path: 'token/$address',
  component: ExplorerTypePortfolioTokenPage,
});

export const explorerActivityPage = createRoute({
  getParentRoute: () => explorerLayout,
  path: '/activity',
  component: ExplorerActivityPage,
  validateSearch: validateActivityParams,
});
