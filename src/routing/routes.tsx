import { DebugPage } from 'pages/debug';
import { StrategiesPage } from 'pages/strategies';
import { TradePage } from 'pages/trade';
import { CreateStrategyPage } from 'pages/strategies/create';
import { BntPage } from 'pages/bnt';

export const PathNames = {
  strategies: '/',
  trade: 'trade',
  bnt: 'bnt',
  debug: 'debug',
  createStrategy: 'strategies/create',
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
    path: PathNames.bnt,
    element: <BntPage />,
  },
  {
    path: PathNames.debug,
    element: <DebugPage />,
  },
  {
    path: PathNames.createStrategy,
    element: <CreateStrategyPage />,
  },
];
