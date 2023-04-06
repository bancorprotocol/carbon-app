import { DebugPage } from 'pages/debug';
import { StrategiesPage } from 'pages/strategies';
import { TradePage } from 'pages/trade';
import { CreateStrategyPage } from 'pages/strategies/create';
import { isProduction } from 'utils/helpers';
import { TermsPage } from 'pages/terms';
import { Route } from '@tanstack/react-location';
import { getLastVisitedPair } from 'libs/routing/utils';
import { EditStrategyPage } from 'pages/strategies/edit';
import { EditNewStrategyPage } from 'pages/strategies/id/edit';

export const PathNames = {
  strategies: '/',
  trade: '/trade',
  debug: '/debug',
  createStrategy: '/strategies/create',
  editStrategy: '/strategies/edit',
  editStrategyNew: (id: string) => `/strategies/${id}/edit`,
  terms: '/terms',
};

export const routes: Route[] = [
  {
    path: PathNames.strategies,
    element: <StrategiesPage />,
  },
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
    path: PathNames.editStrategyNew(':id'),
    element: <EditNewStrategyPage />,
  },
  {
    path: PathNames.editStrategy,
    element: <EditStrategyPage />,
  },
  {
    path: PathNames.terms,
    element: <TermsPage />,
  },
  ...(isProduction
    ? []
    : [
        {
          path: PathNames.debug,
          element: <DebugPage />,
        },
      ]),
];
