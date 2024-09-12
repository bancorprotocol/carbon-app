import { StrategyPage } from 'pages/strategy';
import { rootRoute } from './root';
import { Route } from '@tanstack/react-router';
import { validNumber, validateSearchParams } from '../utils';
import {
  ActivitySearchParams,
  activityValidators,
} from 'components/activity/utils';

export const strategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: 'strategy/$id',
  component: StrategyPage,
  validateSearch: validateSearchParams<ActivitySearchParams>({
    ...activityValidators,
    priceStart: validNumber,
    priceEnd: validNumber,
  }),
});
