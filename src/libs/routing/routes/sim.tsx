import { redirect, createRoute } from '@tanstack/react-router';
import { SimulatorProvider } from 'components/simulator/result/SimulatorProvider';
import { rootRoute } from 'libs/routing/routes/root';
import {
  getLastVisitedPair,
  searchValidator,
  validAddress,
  validBoolean,
  validNumber,
} from 'libs/routing/utils';
import { SimulatorPage } from 'pages/simulator';
import { SimulatorInputOverlappingPage } from 'pages/simulator/overlapping';
import { SimulatorInputRecurringPage } from 'pages/simulator/recurring';
import { SimulatorResultPage } from 'pages/simulator/result';
import config from 'config';
import { roundSearchParam } from 'utils/helpers';
import * as v from 'valibot';

export const simulatorRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/simulate',
  validateSearch: searchValidator({
    baseToken: v.optional(validNumber),
    quoteToken: v.optional(validNumber),
    start: v.optional(validNumber),
    end: v.optional(validNumber),
  }),
});

export interface StrategyInputBase {
  baseToken?: string;
  quoteToken?: string;
  start?: string;
  end?: string;
}

export const simulatorInputRootRoute = createRoute({
  getParentRoute: () => simulatorRootRoute,
  path: '/',
  component: SimulatorPage,
  beforeLoad: ({ location }) => {
    if (!config.ui.showSimulator) {
      throw redirect({ to: '/', replace: true });
    }
    if (
      location.pathname === '/simulate' ||
      location.pathname === '/simulate/'
    ) {
      redirect({
        to: '/simulate/overlapping',
        throw: true,
        replace: true,
      });
    }
  },
  validateSearch: (search: Record<string, unknown>): StrategyInputBase => {
    const { start, end } = search;

    if (start && end && Number(start) > Number(end)) {
      throw new Error('Invalid date range');
    }

    const defaultPair = getLastVisitedPair();
    const baseToken = v.is(validAddress, search.baseToken)
      ? search.baseToken
      : defaultPair.base;
    const quoteToken = v.is(validAddress, search.quoteToken)
      ? search.quoteToken
      : defaultPair.quote;

    return {
      baseToken,
      quoteToken,
      start: start as string | undefined,
      end: end as string | undefined,
    };
  },
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
  validateSearch: (
    search: Record<string, unknown>,
  ): SimulatorInputOverlappingSearch => {
    const sellMax = v.is(validNumber, search.sellMax)
      ? roundSearchParam(search.sellMax)
      : '';
    const buyMin = v.is(validNumber, search.buyMin)
      ? roundSearchParam(search.buyMin)
      : '';
    const spread = v.is(validNumber, search.spread) ? search.spread : '1';

    return {
      sellMax,
      buyMin,
      spread,
    };
  },
});

export type SimulatorResultSearch = Required<StrategyInputSearch> & {
  type: SimulatorType;
  buyMarginal?: string;
  sellMarginal?: string;
  spread?: string;
};

export const simulatorResultRoute = createRoute({
  getParentRoute: () => simulatorRootRoute,
  path: 'result',
  component: () => (
    <SimulatorProvider>
      <SimulatorResultPage />
    </SimulatorProvider>
  ),
  validateSearch: (search: Record<string, string>): SimulatorResultSearch => {
    if (Number(search.start) <= 0) {
      throw new Error('Invalid start date');
    }
    if (Number(search.end) <= 0) {
      throw new Error('Invalid end date');
    }
    if (Number(search.start) > Number(search.end)) {
      throw new Error('Invalid date range');
    }
    if (!v.is(validAddress, search.baseToken)) {
      throw new Error('Invalid base token');
    }
    if (!v.is(validAddress, search.quoteToken)) {
      throw new Error('Invalid quote token');
    }
    if (!v.is(validNumber, search.sellBudget)) {
      throw new Error('Invalid base budget');
    }
    if (!v.is(validNumber, search.buyBudget)) {
      throw new Error('Invalid quote budget');
    }
    if (!v.is(validNumber, search.sellMax)) {
      throw new Error('Invalid sell max');
    }
    if (!v.is(validNumber, search.sellMin)) {
      throw new Error('Invalid sell min');
    }
    if (!v.is(validNumber, search.buyMax)) {
      throw new Error('Invalid buy max');
    }
    if (!v.is(validNumber, search.buyMin)) {
      throw new Error('Invalid buy min');
    }
    if (!v.is(validBoolean, search.sellIsRange)) {
      throw new Error('Invalid sell is range');
    }
    if (!v.is(validBoolean, search.buyIsRange)) {
      throw new Error('Invalid buy is range');
    }

    const type: SimulatorType =
      search.type === 'overlapping' ? 'overlapping' : 'recurring';

    return {
      start: search.start,
      end: search.end,
      baseToken: search.baseToken.toLowerCase(),
      quoteToken: search.quoteToken.toLowerCase(),
      sellMax: search.sellMax,
      sellMin: search.sellMin,
      sellBudget: search.sellBudget || '0',
      // TODO add validation
      sellMarginal: search.sellMarginal || '0',
      sellIsRange: search.sellIsRange,
      buyMax: search.buyMax,
      buyMin: search.buyMin,
      buyMarginal: search.buyMarginal || '0',
      buyBudget: search.buyBudget || '0',
      buyIsRange: search.buyIsRange,
      // TODO add validation
      spread: search.spread,
      type,
    };
  },
  errorComponent: (e) => <div>Invalid search: {e.error.message}</div>,
});
