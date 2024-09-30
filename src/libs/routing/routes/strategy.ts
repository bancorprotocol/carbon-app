import { StrategyPage } from 'pages/strategy';
import { rootRoute } from './root';
import { createRoute } from '@tanstack/react-router';
import { InferSearch, searchValidator, validNumber } from '../utils';
import { activityValidators } from 'components/activity/utils';
import { defaultEnd, defaultStart } from 'components/strategies/common/utils';
import * as v from 'valibot';

const schema = {
  ...activityValidators,
  priceStart: v.optional(validNumber, defaultStart().toString()),
  priceEnd: v.optional(validNumber, defaultEnd().toString()),
  hideIndicators: v.optional(v.boolean()),
};

export type StrategyPageSearch = InferSearch<typeof schema>;

export const strategyPage = createRoute({
  getParentRoute: () => rootRoute,
  path: 'strategy/$id',
  component: StrategyPage,
  validateSearch: searchValidator(schema),
});
