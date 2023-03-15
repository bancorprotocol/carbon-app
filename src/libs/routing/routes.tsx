import { DebugPage } from 'pages/debug';
import { StrategiesPage } from 'pages/strategies';
import { TradePage } from 'pages/trade';
import { CreateStrategyPage } from 'pages/strategies/create';
import { isProduction } from 'utils/helpers';
import { TermsPage } from 'pages/terms';
import { Navigate, Route } from '@tanstack/react-location';
import { config } from 'services/web3/config';
import { lsService } from 'services/localeStorage';

const [base, quote] = lsService.getItem('tradePair') || [
  config.tokens.ETH,
  config.tokens.USDC,
];

export const PathNames = {
  strategies: '/',
  trade: '/trade',
  debug: '/debug',
  createStrategy: '/strategies/create',
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
    search: (search) => {
      return search.base && search.quote;
    },
  },
  {
    id: 'trade-redirect',
    path: PathNames.trade,
    element: (
      <Navigate replace={true} to={PathNames.trade} search={{ base, quote }} />
    ),
    search: (search) => {
      return !search.base || !search.quote;
    },
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
