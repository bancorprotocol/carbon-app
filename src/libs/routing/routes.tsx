import { DebugPage } from 'pages/debug';
import { StrategiesPage } from 'pages/strategies';
import { TradePage } from 'pages/trade';
import { CreateStrategyPage } from 'pages/strategies/create';
import { isProduction } from 'utils/helpers';

export const PathNames = {
  strategies: '/',
  trade: '/trade',
  debug: '/debug',
  createStrategy: '/strategies/create',
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
  ...(isProduction
    ? []
    : [
        {
          path: PathNames.debug,
          element: <DebugPage />,
        },
      ]),
];
