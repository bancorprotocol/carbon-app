import { StrategyPage } from 'pages/strategy';
import { rootRoute } from './root';
import { Route } from '@tanstack/react-router';

export const strategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: 'strategy/$id',
  component: StrategyPage,
});
