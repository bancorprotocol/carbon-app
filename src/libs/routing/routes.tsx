import { DebugPage } from 'pages/debug';
import { StrategiesPage } from 'pages/strategies';
import { TradePage } from 'pages/trade';
import { CreateStrategyPage } from 'pages/strategies/create';
import { isProduction } from 'utils/helpers/helpers';
import { TermsPage } from 'pages/terms';

export const PathNames = {
  strategies: '/',
  trade: '/trade',
  debug: '/debug',
  createStrategy: '/strategies/create',
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
