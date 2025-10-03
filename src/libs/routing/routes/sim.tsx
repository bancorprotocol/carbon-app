import { redirect, createRoute } from '@tanstack/react-router';
import { SimulatorProvider } from 'components/simulator/result/SimulatorProvider';
import { rootRoute } from 'libs/routing/routes/root';
import {
  searchValidator,
  validAddress,
  validBoolean,
  validNumber,
} from 'libs/routing/utils';
import { SimulatorRoot } from 'pages/simulator/root';
import { SimulatorInputOverlappingPage } from 'pages/simulator/overlapping';
import { SimulatorInputRecurringPage } from 'pages/simulator/recurring';
import { SimulatorResultPage } from 'pages/simulator/result';
import { roundSearchParam } from 'utils/helpers';
import config from 'config';
import * as v from 'valibot';

export interface StrategyInputBase {
  baseToken?: string;
  quoteToken?: string;
  start?: string;
  end?: string;
}

export const simulatorInputRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/simulate',
  component: SimulatorRoot,
  beforeLoad: ({ location, search }) => {
    if (!config.ui.showSimulator) {
      throw redirect({ to: '/', replace: true });
    }
    if (location.pathname.endsWith('simulate')) {
      throw redirect({ to: '/simulate/overlapping', search });
    }
  },
  validateSearch: searchValidator({
    baseToken: v.optional(validAddress),
    quoteToken: v.optional(validAddress),
    start: v.optional(validNumber),
    end: v.optional(validNumber),
  }),
});

export interface StrategyInputSearch extends StrategyInputBase {
  sellBudget?: string;
  sellMax?: string;
  sellMin?: string;
  sellIsRange?: boolean;
  buyMax?: string;
  buyMin?: string;
  buyBudget?: string;
  buyIsRange?: boolean;
}

export type SimulatorType = 'overlapping' | 'recurring';

export const simulatorInputRecurringRoute = createRoute({
  getParentRoute: () => simulatorInputRootRoute,
  path: 'recurring',
  component: SimulatorInputRecurringPage,
  validateSearch: (search: Record<string, unknown>): StrategyInputSearch => {
    const sellMax = v.is(validNumber, search.sellMax)
      ? roundSearchParam(search.sellMax)
      : '';
    const sellMin = v.is(validNumber, search.sellMin)
      ? roundSearchParam(search.sellMin)
      : '';
    const sellBudget = v.is(validNumber, search.sellBudget)
      ? roundSearchParam(search.sellBudget)
      : '';
    const buyMax = v.is(validNumber, search.buyMax)
      ? roundSearchParam(search.buyMax)
      : '';
    const buyMin = v.is(validNumber, search.buyMin)
      ? roundSearchParam(search.buyMin)
      : '';
    const buyBudget = v.is(validNumber, search.buyBudget)
      ? roundSearchParam(search.buyBudget)
      : '';
    const sellIsRange =
      typeof search.sellIsRange === 'boolean' ? search.sellIsRange : true;
    const buyIsRange =
      typeof search.buyIsRange === 'boolean' ? search.buyIsRange : true;

    return {
      sellMax: sellIsRange ? sellMax : sellMin,
      sellMin,
      sellBudget,
      buyMax: buyIsRange ? buyMax : buyMin,
      buyMin,
      buyBudget,
      sellIsRange,
      buyIsRange,
    };
  },
});

export interface SimulatorInputOverlappingSearch extends StrategyInputBase {
  sellMax?: string;
  buyMin?: string;
  spread?: string;
}

export const simulatorInputOverlappingRoute = createRoute({
  getParentRoute: () => simulatorInputRootRoute,
  path: 'overlapping',
  component: SimulatorInputOverlappingPage,
  validateSearch: searchValidator({
    sellMax: v.optional(validNumber),
    buyMin: v.optional(validNumber),
    spread: v.optional(v.fallback(validNumber, '1')),
  }),
});

export type SimulatorResultSearch = Required<StrategyInputSearch> & {
  type: SimulatorType;
  buyMarginal?: string;
  sellMarginal?: string;
  spread?: string;
};

export const simulatorResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'simulate/result',
  component: () => (
    <SimulatorProvider>
      <SimulatorResultPage />
    </SimulatorProvider>
  ),
  validateSearch: searchValidator({
    baseToken: validAddress,
    quoteToken: validAddress,
    start: validNumber,
    end: validNumber,
    sellMax: validNumber,
    sellMin: validNumber,
    sellBudget: validNumber,
    sellMarginal: v.optional(validNumber),
    sellIsRange: validBoolean,
    buyMax: validNumber,
    buyMin: validNumber,
    buyMarginal: v.optional(validNumber),
    buyBudget: validNumber,
    buyIsRange: validBoolean,
    spread: v.optional(validNumber),
    type: v.picklist(['overlapping', 'recurring']),
  }),
  errorComponent: (e) => <div>Invalid search: {e.error.message}</div>,
});
