import { Route } from '@tanstack/react-router';
import { SimulatorProvider } from 'libs/d3';
import { rootRoute } from 'libs/routing/routes/root';
import { SimulatorPage } from 'pages/simulator';
import { SimulatorResultPage } from 'pages/simulator/result';

interface SimulatorSearchBase {
  baseToken: string;
  baseBudget: string;
  quoteToken: string;
  quoteBudget: string;
  sellMax: string;
  sellMin: string;
  buyMax: string;
  buyMin: string;
}

export interface SimulatorInputSearch extends SimulatorSearchBase {
  isBuyLimit?: boolean;
  isSellLimit?: boolean;
}

export const simulatorPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/simulator',
  component: SimulatorPage,
  validateSearch: (search: Record<string, string>): SimulatorInputSearch => {
    return {
      baseToken: search.baseToken || '',
      baseBudget: search.baseBudget || '',
      quoteToken: search.quoteToken || '',
      quoteBudget: search.quoteBudget || '',
      sellMax: search.sellMax || '',
      sellMin: search.sellMin || '',
      buyMax: (search.buyMax as string) || '',
      buyMin: search.buyMin || '',
      // isBuyLimit: Boolean(search.isBuyLimit),
      // isSellLimit: Boolean(search.isSellLimit),
    };
  },
});

export interface SimulatorResultSearch extends SimulatorSearchBase {
  start: string;
  end: string;
}

export const simulatorResultPage = new Route({
  getParentRoute: () => rootRoute,
  path: '/simulator/result',
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
    if (!search.baseToken.toLowerCase().startsWith('0x')) {
      throw new Error('Invalid base token');
    }
    if (search.baseToken.length !== 42) {
      throw new Error('Invalid base token');
    }
    if (!search.quoteToken.toLowerCase().startsWith('0x')) {
      throw new Error('Invalid base token');
    }
    if (search.quoteToken.length !== 42) {
      throw new Error('Invalid base token');
    }
    if (isNaN(Number(search.baseBudget))) {
      throw new Error('Invalid base budget');
    }
    if (isNaN(Number(search.quoteBudget))) {
      throw new Error('Invalid quote budget');
    }
    if (isNaN(Number(search.sellMax))) {
      throw new Error('Invalid sell max');
    }
    if (isNaN(Number(search.sellMin))) {
      throw new Error('Invalid sell min');
    }
    if (isNaN(Number(search.buyMax))) {
      throw new Error('Invalid buy max');
    }
    if (isNaN(Number(search.buyMin))) {
      throw new Error('Invalid buy min');
    }

    return {
      start: search.start,
      end: search.end,
      baseToken: search.baseToken.toLowerCase(),
      baseBudget: search.baseBudget,
      quoteToken: search.quoteToken.toLowerCase(),
      quoteBudget: search.quoteBudget,
      sellMax: search.sellMax,
      sellMin: search.sellMin,
      buyMax: search.buyMax,
      buyMin: search.buyMin,
    };
  },
  // @ts-ignore
  errorComponent: (e) => <div>Invalid search: {e.error.message}</div>,
});
