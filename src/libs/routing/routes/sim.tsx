import { redirect, createRoute } from '@tanstack/react-router';
import { SimulatorProvider } from 'components/simulator/result/SimulatorProvider';
import { rootRoute } from 'libs/routing/routes/root';
import {
  searchValidator,
  validAddress,
  validBoolean,
  validDirection,
  validInputNumber,
  validNumber,
  validSettings,
} from 'libs/routing/utils';
import { SimulatorRoot } from 'pages/simulator/root';
import { SimulatorInputOverlappingPage } from 'pages/simulator/overlapping';
import { SimulatorInputRecurringPage } from 'pages/simulator/recurring';
import { SimulatorResultPage } from 'pages/simulator/result';
import { defaultSpread } from 'components/strategies/overlapping/utils';
import config from 'config';
import * as v from 'valibot';

export interface StrategyInputBase {
  base?: string;
  quote?: string;
  chartStart?: string;
  chartEnd?: string;
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
    base: v.optional(validAddress),
    quote: v.optional(validAddress),
    chartStart: v.optional(validNumber),
    chartEnd: v.optional(validNumber),
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
  beforeLoad: ({ search }) => {
    if (!search.sellSettings && typeof search.sellIsRange === 'boolean') {
      search.sellSettings = search.sellIsRange ? 'range' : 'limit';
    }
    if (!search.buySettings && typeof search.buyIsRange === 'boolean') {
      search.buySettings = search.buyIsRange ? 'range' : 'limit';
    }
    delete search.sellIsRange;
    delete search.buyIsRange;
  },
  validateSearch: searchValidator({
    sellMax: v.optional(validNumber),
    sellMin: v.optional(validNumber),
    sellBudget: v.optional(validNumber),
    sellSettings: v.optional(validSettings, 'range'),
    buyMax: v.optional(validNumber),
    buyMin: v.optional(validNumber),
    buyBudget: v.optional(validNumber),
    buySettings: v.optional(validSettings),
    // @deprecated (March 2026)
    sellIsRange: v.optional(validBoolean),
    buyIsRange: v.optional(validBoolean),
  }),
});

export interface SimulatorInputOverlappingSearch extends StrategyInputBase {
  sellMax?: string;
  buyMin?: string;
  spread?: string;
  anchor?: 'buy' | 'sell';
  budget?: string;
  fullRange?: boolean;
}

export const simulatorInputOverlappingRoute = createRoute({
  getParentRoute: () => simulatorInputRootRoute,
  path: 'overlapping',
  component: SimulatorInputOverlappingPage,
  beforeLoad: ({ search }) => {
    if (!search.min && search.buyMin) search.min = search.buyMin;
    if (!search.max && search.sellMax) search.max = search.sellMax;
    if (!search.preset && search.fullRange) search.preset = 'Infinity';
    delete search.buyMin;
    delete search.sellMax;
    delete search.fullRange;
  },
  validateSearch: searchValidator({
    min: v.optional(validInputNumber),
    max: v.optional(validInputNumber),
    preset: v.optional(validNumber),
    spread: v.optional(validNumber, defaultSpread),
    anchor: v.optional(validDirection),
    budget: v.optional(validNumber),
    // @deprecated (March 2026)
    fullRange: v.optional(validBoolean),
    sellMax: v.optional(validNumber),
    buyMin: v.optional(validNumber),
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
    base: validAddress,
    quote: validAddress,
    chartStart: validNumber,
    chartEnd: validNumber,
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
