import { DebugPage } from 'pages/debug';
import { StrategiesPage } from 'pages/strategies';
import { TradePage } from 'pages/trade';
import { CreateStrategyPage } from 'pages/strategies/create';
import { isProduction } from 'utils/helpers';
import { TermsPage } from 'pages/terms';
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

export const routes = [
  {
    path: PathNames.strategies,
    element: <StrategiesPage />,
  },
  {
    path: PathNames.trade,
    element: <TradePage />,
  },
  {
    path: PathNames.createStrategy,
    element: <CreateStrategyPage />,
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
