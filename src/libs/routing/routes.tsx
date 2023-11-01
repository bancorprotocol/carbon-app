import { Navigate, Route } from '@tanstack/react-router';
import { ExplorerPage } from 'pages/explorer';
import { ExplorerTypePage } from 'pages/explorer/type';
import { ExplorerTypeOverviewPage } from 'pages/explorer/type/overview';
import { ExplorerTypePortfolioPage } from 'pages/explorer/type/portfolio';
import { ExplorerTypePortfolioTokenPage } from 'pages/explorer/type/portfolio/token';
import { StrategiesPage } from 'pages/strategies';
import { debugPage } from 'pages/debug';
import { tradePage } from 'pages/trade';
import { createStrategyPage } from 'pages/strategies/create';
import { termPage } from 'pages/terms';
import { editStrategyPage } from 'pages/strategies/edit';
import { privacyPage } from 'pages/privacy';
import { StrategiesPortfolioPage } from 'pages/strategies/portfolio';
import { StrategiesOverviewPage } from 'pages/strategies/overview';
import { StrategiesPortfolioTokenPage } from 'pages/strategies/portfolio/token';
import { appRoute } from 'App';

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

//////////////
// STRATEGY //
//////////////

const myStrategyPage = new Route({
  getParentRoute: () => appRoute,
  id: 'my-strategy-layout',
  component: StrategiesPage,
});
const strategyOverview = new Route({
  getParentRoute: () => myStrategyPage,
  path: '/',
  component: StrategiesOverviewPage,
});
const strategyPortflio = new Route({
  getParentRoute: () => myStrategyPage,
  path: 'strategies/portfolio',
});
const strategyPortflioPage = new Route({
  getParentRoute: () => strategyPortflio,
  path: '/',
  component: StrategiesPortfolioPage,
});
const strategyPortflioToken = new Route({
  getParentRoute: () => strategyPortflio,
  path: 'token/$address',
  component: StrategiesPortfolioTokenPage,
});
myStrategyPage.addChildren([strategyOverview, strategyPortflio]);
strategyPortflio.addChildren([strategyPortflioPage, strategyPortflioToken]);

//////////////
// EXPLORER //
//////////////

const explorerPage = new Route({
  getParentRoute: () => appRoute,
  path: 'explorer',
});

const explorerIndex = new Route({
  getParentRoute: () => explorerPage,
  path: '/',
  component: () => <Navigate to="/explorer/wallet" />,
});

const explorerType = new Route({
  getParentRoute: () => explorerPage,
  path: '$type',
  component: ExplorerPage,
});
const explorerTypePage = new Route({
  getParentRoute: () => explorerType,
  path: '/',
  component: ExplorerTypePage,
});

const explorerResult = new Route({
  getParentRoute: () => explorerPage,
  path: '$type/$slug',
  // search: (_search) => {
  //   // if pathname contains either /wallet/something or /token-pair/something return true
  //   if (document.location.pathname.match(/\/(wallet|token-pair)\/.+/)) {
  //     return true;
  //   }
  //   return false;
  // },
  component: ExplorerPage,
});

const explorerOverview = new Route({
  getParentRoute: () => explorerResult,
  path: '/',
  component: ExplorerTypeOverviewPage,
});

const explorerPortfolio = new Route({
  getParentRoute: () => explorerResult,
  path: 'portfolio',
});

const explorerPortfolioPage = new Route({
  getParentRoute: () => explorerPortfolio,
  path: '/',
  component: ExplorerTypePortfolioPage,
});
const explorerPortfolioToken = new Route({
  getParentRoute: () => explorerPortfolio,
  path: 'token/$address',
  component: ExplorerTypePortfolioTokenPage,
});

explorerPage.addChildren([explorerIndex, explorerType, explorerResult]);
explorerType.addChildren([explorerTypePage]);
explorerResult.addChildren([explorerOverview, explorerPortfolio]);
explorerPortfolio.addChildren([explorerPortfolioPage, explorerPortfolioToken]);

export const routeTree = appRoute.addChildren([
  tradePage,
  createStrategyPage,
  editStrategyPage,
  termPage,
  privacyPage,
  debugPage,
  explorerPage,
  myStrategyPage,
]);
console.log(routeTree);
