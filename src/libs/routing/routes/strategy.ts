import { StrategyPage } from 'pages/strategy';
import { rootRoute } from './root';
import { Route } from '@tanstack/react-router';
import { validBoolean, validNumber } from '../utils';
import {
  activityValidators,
  validateActivityParams,
} from 'components/activity/utils';
import { defaultEnd, defaultStart } from 'components/strategies/common/utils';

export const strategyPage = new Route({
  getParentRoute: () => rootRoute,
  path: 'strategy/$id',
  component: StrategyPage,
  beforeLoad: ({ search }) => {
    search.priceStart ||= defaultStart().toString();
    search.priceEnd ||= defaultEnd().toString();
  },
  validateSearch: validateActivityParams({
    ...activityValidators,
    priceStart: validNumber,
    priceEnd: validNumber,
    hideIndicators: validBoolean,
  }),
});
