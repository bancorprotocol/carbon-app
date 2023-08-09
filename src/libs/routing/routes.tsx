import { DebugPage } from 'pages/debug';
import { ExplorerPage } from 'pages/explorer';
import { ExplorerTypePage } from 'pages/explorer/type';
import { ExplorerTypeOverviewPage } from 'pages/explorer/type/overview';
import { ExplorerTypePortfolioPage } from 'pages/explorer/type/portfolio';
import { ExplorerTypePortfolioTokenPage } from 'pages/explorer/type/portfolio/token';
import { StrategiesPage } from 'pages/strategies';
import { TradePage } from 'pages/trade';
import { CreateStrategyPage } from 'pages/strategies/create';
import { TermsPage } from 'pages/terms';
import { Navigate, Outlet, Route } from '@tanstack/react-location';
import { getLastVisitedPair } from 'libs/routing/utils';
import { EditStrategyPage } from 'pages/strategies/edit';
import { PrivacyPage } from 'pages/privacy';
import { StrategiesPortfolioPage } from 'pages/strategies/portfolio';
import { StrategiesOverviewPage } from 'pages/strategies/overview';
import { StrategiesPortfolioTokenPage } from 'pages/strategies/portfolio/token';

export const externalLinks = {
  blog: 'http://blog.carbondefi.xyz',
  faq: 'https://faq.carbondefi.xyz/',
  analytics: 'http://analytics.carbondefi.xyz',
  twitter: 'https://twitter.com/carbondefixyz',
  youtube: 'https://www.youtube.com/c/BancorProtocol',
  discord: 'https://discord.gg/bancor',
  telegram: 'https://t.me/CarbonDeFixyz',
  techDocs: 'https://docs.carbondefi.xyz/',
  litePaper: 'https://carbondefi.xyz/litepaper',
  whitepaper: 'https://carbondefi.xyz/whitepaper',
  simulatorRepo: 'https://github.com/bancorprotocol/carbon-simulator',
  interactiveSim: 'https://simulator.carbondefi.xyz/',
  roiLearnMore: 'https://faq.carbondefi.xyz/strategy-roi-and-apr',
};

export const PathNames = {
  strategies: '/',
  portfolio: '/strategies/portfolio',
  portfolioToken: (address: string) => `/strategies/portfolio/token/${address}`,
  trade: '/trade',
  debug: '/debug',
  createStrategy: '/strategies/create',
  editStrategy: '/strategies/edit',
  terms: '/terms',
  privacy: '/privacy',
  explorer: '/explorer',
};

export const routes: Route[] = [
  {
    id: 'trade',
    path: PathNames.trade,
    element: <TradePage />,
    searchFilters: [
      (search) => {
        if (search.base && search.quote) {
          return search;
        }
        return { ...search, ...getLastVisitedPair() };
      },
    ],
  },
  {
    path: PathNames.createStrategy,
    element: <CreateStrategyPage />,
    searchFilters: [
      (search) => {
        if (
          search.strategyType === 'recurring' ||
          search.strategyType === 'disposable' ||
          search.encodedStrategy
        ) {
          return search;
        }
        return { ...search, strategyType: 'recurring' };
      },
    ],
  },
  {
    path: PathNames.editStrategy,
    element: <EditStrategyPage />,
  },
  {
    path: PathNames.terms,
    element: <TermsPage />,
  },
  {
    path: PathNames.privacy,
    element: <PrivacyPage />,
  },
  {
    path: PathNames.debug,
    element: <DebugPage />,
  },
  {
    element: <Outlet />,
    path: PathNames.explorer,
    children: [
      {
        path: '/',
        element: <Navigate replace to={'wallet'} />,
      },
      {
        path: ':type/:slug',
        element: <ExplorerPage />,
        children: [
          {
            path: '/',
            element: <ExplorerTypeOverviewPage />,
          },
          {
            path: 'portfolio',
            element: <Outlet />,
            children: [
              {
                path: '/',
                element: <ExplorerTypePortfolioPage />,
              },
              {
                path: 'token/:address',
                element: <ExplorerTypePortfolioTokenPage />,
              },
            ],
          },
        ],
      },
      {
        path: ':type',
        element: <ExplorerPage />,
        children: [
          {
            path: '/',
            element: <ExplorerTypePage />,
          },
        ],
      },
    ],
  },
  {
    element: <StrategiesPage />,
    children: [
      {
        path: '/',
        element: <StrategiesOverviewPage />,
      },
      {
        path: 'strategies/portfolio',
        element: <Outlet />,
        children: [
          {
            path: '/',
            element: <StrategiesPortfolioPage />,
          },
          {
            path: 'token/:address',
            element: <StrategiesPortfolioTokenPage />,
          },
        ],
      },
    ],
  },
];
