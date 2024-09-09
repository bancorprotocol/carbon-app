import { StrategyPage } from 'pages/strategy';
import { rootRoute } from './root';
import { Route } from '@tanstack/react-router';
import { validateSearchParams, validNumber } from '../utils';
import {
  ActivitySearchParams,
  activityValidators,
} from 'components/activity/utils';

type StrategySearch = ActivitySearchParams & {
  priceStart: string;
  priceEnd: string;
};

export const strategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: 'strategy/$id',
  component: StrategyPage,
  validateSearch: validateSearchParams<StrategySearch>({
    ...activityValidators,
    priceStart: validNumber,
    priceEnd: validNumber,
  }),
});
