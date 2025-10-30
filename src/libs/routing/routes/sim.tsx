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
import config from 'config';
import * as v from 'valibot';

export interface StrategyInputBase {
  base?: string;
  quote?: string;
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
    base: v.optional(validAddress),
    quote: v.optional(validAddress),
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
  validateSearch: searchValidator({
    sellMax: v.optional(validNumber),
    sellMin: v.optional(validNumber),
    sellBudget: v.optional(validNumber),
    sellIsRange: v.optional(validBoolean, true),
    buyMax: v.optional(validNumber),
    buyMin: v.optional(validNumber),
    buyBudget: v.optional(validNumber),
    buyIsRange: v.optional(validBoolean, true),
  }),
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
    base: validAddress,
    quote: validAddress,
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
