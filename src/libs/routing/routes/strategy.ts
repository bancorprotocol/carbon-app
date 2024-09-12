import { StrategyPage } from 'pages/strategy';
import { rootRoute } from './root';
import { Route } from '@tanstack/react-router';
import { validNumber } from '../utils';
import {
  activityValidators,
  validateActivityParams,
} from 'components/activity/utils';

export const strategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: 'strategy/$id',
  component: StrategyPage,
  validateSearch: validateActivityParams({
    ...activityValidators,
    priceStart: validNumber,
    priceEnd: validNumber,
  }),
});
