import { explorerLayout } from 'pages/explorer';
import { myStrategyLayout } from 'pages/strategies';
import { debugPage } from 'pages/debug';
import { tradePage } from 'pages/trade';
import { createStrategyPage } from 'pages/strategies/create';
import { termPage } from 'pages/terms';
import { editStrategyPage } from 'pages/strategies/edit';
import { privacyPage } from 'pages/privacy';
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

export const routeTree = appRoute.addChildren([
  tradePage,
  createStrategyPage,
  editStrategyPage,
  termPage,
  privacyPage,
  debugPage,
  explorerLayout,
  myStrategyLayout,
]);
