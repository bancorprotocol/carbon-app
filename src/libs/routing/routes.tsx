import { ExplorerPage } from 'pages/explorer';
import { StrategiesPage } from 'pages/strategies';
import { TradePage } from 'pages/trade';
import { CreateStrategyPage } from 'pages/strategies/create';
import { DebugPage } from 'pages/debug';
import { TermsPage } from 'pages/terms';
import { EditStrategyPage } from 'pages/strategies/edit';
import { PrivacyPage } from 'pages/privacy';
import { App } from 'App';
import { Navigate, RootRoute, Route } from '@tanstack/react-router';
import { PathNames } from './pathnames';
import { ExplorerTypePage } from 'pages/explorer/type';
import { ExplorerTypePortfolioPage } from 'pages/explorer/type/portfolio';
import { ExplorerTypePortfolioTokenPage } from 'pages/explorer/type/portfolio/token';
import { ExplorerTypeOverviewPage } from 'pages/explorer/type/overview';
import { StrategiesOverviewPage } from 'pages/strategies/overview';
import { StrategiesPortfolioTokenPage } from 'pages/strategies/portfolio/token';
import { StrategiesPortfolioPage } from 'pages/strategies/portfolio';

export const externalLinks = {
  blog: 'http://blog.carbondefi.xyz',
  faq: 'https://faq.carbondefi.xyz/',
  analytics: 'http://analytics.carbondefi.xyz',
  x: 'https://x.com/carbondefixyz',
  youtube: 'https://www.youtube.com/c/BancorProtocol',
  discord: 'https://discord.gg/bancor',
  telegram: 'https://t.me/CarbonDeFixyz',
  techDocs: 'https://docs.carbondefi.xyz/',
  litePaper: 'https://carbondefi.xyz/litepaper',
  whitepaper: 'https://carbondefi.xyz/whitepaper',
  simulatorRepo: 'https://github.com/bancorprotocol/carbon-simulator',
  interactiveSim: 'https://simulator.carbondefi.xyz/',
  duneDashboard: 'https://dune.com/bancor/carbon-by-bancor',
  roiLearnMore: 'https://faq.carbondefi.xyz/strategy-roi-and-apr',
};

export const appRoute = new RootRoute({
  component: App,
});

const termPage = new Route({
  getParentRoute: () => appRoute,
  path: '/terms',
  component: TermsPage,
});

const privacyPage = new Route({
  getParentRoute: () => appRoute,
  path: '/privacy',
  component: PrivacyPage,
});

const debugPage = new Route({
  getParentRoute: () => appRoute,
  path: '/debug',
  component: DebugPage,
});

const tradePage = new Route({
  getParentRoute: () => appRoute,
  path: '/trade',
  component: TradePage,
});

const createStrategyPage = new Route({
  getParentRoute: () => appRoute,
  path: '/strategies/create',
  component: CreateStrategyPage,
  validateSearch: (search) => {
    if (
      search.strategyType === 'recurring' ||
      search.strategyType === 'disposable' ||
      search.encodedStrategy
    ) {
      return search;
    }
    return { ...search, strategyType: 'recurring' };
  },
});

const editStrategyPage = new Route({
  getParentRoute: () => appRoute,
  path: PathNames.editStrategy,
  component: EditStrategyPage,
});

// MY STRATEGY
export const myStrategyLayout = new Route({
  getParentRoute: () => appRoute,
  id: 'my-strategy-layout',
  component: StrategiesPage,
});

export const strategyOverviewPage = new Route({
  getParentRoute: () => myStrategyLayout,
  path: '/',
  component: StrategiesOverviewPage,
});
export const strategyPortflioLayout = new Route({
  getParentRoute: () => myStrategyLayout,
  path: 'strategies/portfolio',
});

export const strategyPortflioTokenPage = new Route({
  getParentRoute: () => strategyPortflioLayout,
  path: 'token/$address',
  component: StrategiesPortfolioTokenPage,
});

export const strategyPortflioPage = new Route({
  getParentRoute: () => strategyPortflioLayout,
  path: '/',
  component: StrategiesPortfolioPage,
});
strategyPortflioLayout.addChildren([
  strategyPortflioPage,
  strategyPortflioTokenPage,
]);

myStrategyLayout.addChildren([strategyOverviewPage, strategyPortflioLayout]);

// EXPLORER
const explorerLayout = new Route({
  getParentRoute: () => appRoute,
  path: 'explorer',
});

const explorerRedirect = new Route({
  getParentRoute: () => explorerLayout,
  path: '/',
  component: () => <Navigate to="/explorer/wallet" />,
});

const explorerPage = new Route({
  getParentRoute: () => explorerLayout,
  path: '$type',
  component: ExplorerPage,
});

const explorerResultLayout = new Route({
  getParentRoute: () => explorerPage,
  path: '$slug',
});

const explorerTypePage = new Route({
  getParentRoute: () => explorerPage,
  path: '/',
  component: ExplorerTypePage,
});

const explorerOverviewPage = new Route({
  getParentRoute: () => explorerResultLayout,
  path: '/',
  component: ExplorerTypeOverviewPage,
});

const explorerPortfolioLayout = new Route({
  getParentRoute: () => explorerResultLayout,
  path: 'portfolio',
});

const explorerPortfolioPage = new Route({
  getParentRoute: () => explorerPortfolioLayout,
  path: '/',
  component: ExplorerTypePortfolioPage,
});

const explorerPortfolioTokenPage = new Route({
  getParentRoute: () => explorerPortfolioLayout,
  path: 'token/$address',
  component: ExplorerTypePortfolioTokenPage,
});

explorerPortfolioLayout.addChildren([
  explorerPortfolioPage,
  explorerPortfolioTokenPage,
]);

explorerLayout.addChildren([explorerRedirect, explorerPage]);
explorerPage.addChildren([explorerTypePage, explorerResultLayout]);
explorerResultLayout.addChildren([
  explorerOverviewPage,
  explorerPortfolioLayout,
]);

export const routeTree = appRoute.addChildren([
  termPage,
  privacyPage,
  debugPage,
  tradePage,
  createStrategyPage,
  editStrategyPage,
  explorerLayout,
  myStrategyLayout,
]);
