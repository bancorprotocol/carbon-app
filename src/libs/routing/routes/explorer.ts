import { redirect, Route } from '@tanstack/react-router';
import { rootRoot } from 'libs/routing/routes/root';
import { ExplorerPage } from 'pages/explorer';
import { ExplorerTypePage } from 'pages/explorer/type';
import { ExplorerTypeOverviewPage } from 'pages/explorer/type/overview';
import { ExplorerTypePortfolioPage } from 'pages/explorer/type/portfolio';
import { ExplorerTypePortfolioTokenPage } from 'pages/explorer/type/portfolio/token';

export const explorerLayout = new Route({
  getParentRoute: () => rootRoot,
  path: '/explorer',
});

export const explorerRedirect = new Route({
  getParentRoute: () => explorerLayout,
  path: '/',
  loader: () => {
    redirect({ to: '/explorer/$type', params: { type: 'token-pair' } });
  },
});

export const explorerPage = new Route({
  getParentRoute: () => explorerLayout,
  path: '$type',
  component: ExplorerPage,
});

export const explorerResultLayout = new Route({
  getParentRoute: () => explorerPage,
  path: '$slug',
});

export const explorerTypePage = new Route({
  getParentRoute: () => explorerPage,
  path: '/',
  component: ExplorerTypePage,
});

export const explorerOverviewPage = new Route({
  getParentRoute: () => explorerResultLayout,
  path: '/',
  component: ExplorerTypeOverviewPage,
});

export const explorerPortfolioLayout = new Route({
  getParentRoute: () => explorerResultLayout,
  path: 'portfolio',
});

export const explorerPortfolioPage = new Route({
  getParentRoute: () => explorerPortfolioLayout,
  path: '/',
  component: ExplorerTypePortfolioPage,
});

export const explorerPortfolioTokenPage = new Route({
  getParentRoute: () => explorerPortfolioLayout,
  path: 'token/$address',
  component: ExplorerTypePortfolioTokenPage,
});
