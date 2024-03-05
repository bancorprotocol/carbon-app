import { redirect, Route } from '@tanstack/react-router';
import { SimulatorProvider } from 'components/simulator/result/SimulatorProvider';
import { rootRoute } from 'libs/routing/routes/root';
import { validAddress, validBoolean, validNumber } from 'libs/routing/utils';
import { defaultEnd, defaultStart, SimulatorPage } from 'pages/simulator';
import { SimulatorResultPage } from 'pages/simulator/result';
import { config } from 'services/web3/config';
import { roundSearchParam, stringToBoolean } from 'utils/helpers';
import * as v from 'valibot';

export const simulatorRootRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/simulate',
});

export interface StrategyInputSearch {
  baseToken?: string;
  quoteToken?: string;
  sellBudget?: string;
  sellMax?: string;
  sellMin?: string;
  sellIsRange?: boolean;
  buyMax?: string;
  buyMin?: string;
  buyBudget?: string;
  buyIsRange?: boolean;
  start?: string;
  end?: string;
}

export const simulatorRedirect = new Route({
  getParentRoute: () => simulatorRootRoute,
  path: '/',
  beforeLoad: () => {
    redirect({
      to: '/simulate/$simulationType',
      params: { simulationType: 'recurring' },
      throw: true,
    });
  },
  component: SimulatorPage,
});

export type SimulatorType = 'recurring' | 'overlapping';

export const simulatorInputRoute = new Route({
  getParentRoute: () => simulatorRootRoute,
  path: '$simulationType',
  component: SimulatorPage,
  parseParams: (params: Record<string, string>) => {
    return { simulationType: params.simulationType as SimulatorType };
  },
  validateSearch: (search: Record<string, string>): StrategyInputSearch => {
    const start =
      Number(search.start) > 0 ? search.start : defaultStart().toString();
    const end = Number(search.end) > 0 ? search.end : defaultEnd().toString();

    if (Number(start) >= Number(end)) {
      throw new Error('Invalid date range');
    }

    const baseToken = v.is(validAddress, search.baseToken)
      ? search.baseToken
      : config.tokens.ETH;
    const quoteToken = v.is(validAddress, search.quoteToken)
      ? search.quoteToken
      : config.tokens.USDC;
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
    const sellIsRange = stringToBoolean(search.sellIsRange, true);
    const buyIsRange = stringToBoolean(search.buyIsRange, true);

    return {
      baseToken,
      quoteToken,
      sellMax: sellIsRange ? sellMax : sellMin,
      sellMin,
      sellBudget,
      buyMax: buyIsRange ? buyMax : buyMin,
      buyMin,
      buyBudget,
      sellIsRange,
      buyIsRange,
      start,
      end,
    };
  },
});

export type SimulatorResultSearch = Required<StrategyInputSearch>;

export const simulatorResultRoute = new Route({
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
    if (Number(search.start) >= Number(search.end)) {
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

    return {
      start: search.start,
      end: search.end,
      baseToken: search.baseToken.toLowerCase(),
      quoteToken: search.quoteToken.toLowerCase(),
      sellMax: search.sellMax,
      sellMin: search.sellMin,
      sellBudget: search.sellBudget || '0',
      sellIsRange: stringToBoolean(search.sellIsRange),
      buyMax: search.buyMax,
      buyMin: search.buyMin,
      buyBudget: search.buyBudget || '0',
      buyIsRange: stringToBoolean(search.buyIsRange),
    };
  },
  // @ts-ignore
  errorComponent: (e) => <div>Invalid search: {e.error.message}</div>,
});
