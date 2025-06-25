import { StrategyPage } from 'pages/strategy';
import { rootRoute } from './root';
import { createRoute, redirect } from '@tanstack/react-router';
import { InferSearch, searchValidator, validNumber } from '../utils';
import { activityValidators } from 'components/activity/utils';
import * as v from 'valibot';
import { toUnixUTCDay } from 'components/simulator/utils';
import { subMonths } from 'date-fns';

const schema = {
  ...activityValidators,
  chartStart: v.optional(validNumber),
  chartEnd: v.optional(validNumber),
  hideIndicators: v.optional(v.boolean()),
};

export type StrategyPageSearch = InferSearch<typeof schema>;

export const strategyPageRoot = createRoute({
  getParentRoute: () => rootRoute,
  path: 'strategy',
});

export const strategyPage = createRoute({
  getParentRoute: () => strategyPageRoot,
  path: '$id',
  component: StrategyPage,
  beforeLoad({ search }) {
    search.chartStart ||= toUnixUTCDay(subMonths(new Date(), 3));
    search.chartEnd ||= toUnixUTCDay(new Date());
  },
  validateSearch: searchValidator(schema),
});

export const strategyPageRedirect = createRoute({
  getParentRoute: () => strategyPageRoot,
  path: '/',
  beforeLoad: ({ location }) => {
    if (
      location.pathname === '/strategy' ||
      location.pathname === '/strategy/'
    ) {
      throw redirect({ to: '/', throw: true, replace: true });
    }
  },
});
