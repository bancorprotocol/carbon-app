import { DebugPage } from 'pages/debug';
import { StrategiesPage } from 'pages/strategies';
import { TradePage } from 'pages/trade';

export const PathNames = {
  strategies: '/',
  trade: 'trade',
  debug: 'debug',
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
    path: PathNames.debug,
    element: <DebugPage />,
  },
];
