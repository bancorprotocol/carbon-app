import { Page } from 'playwright-core';
import marketRate from '../mocks/market-rates.json' with { type: 'json' };
import roi from '../mocks/roi.json' with { type: 'json' };
import historyPrices from '../mocks/history-prices.json' with { type: 'json' };
import simulatorResult from '../mocks/simulator-result.json' with { type: 'json' };
import tokenListsMock from '../mocks/tokenLists.json' with { type: 'json' };
import activityMeta from '../mocks/activity-meta.json' with { type: 'json' };

interface PriceEntry {
  timestamp: number;
  low: string;
  high: string;
  open: string;
  close: string;
}

interface SimulatorResultEntry {
  date: number;
  price: string;
  sell: string;
  buy: string;
  baseBalance: string;
  basePortion: string;
  quoteBalance: string;
  quotePortion: string;
  portfolioValueInQuote: string;
  hodlValueInQuote: string;
  portfolioOverHodlInPercent: string;
}

type SimulatorResult = Record<string, { data: SimulatorResultEntry[] }>;

export const mockApi = async (page: Page) => {
  await page.route('**/*/roi', (route) => {
    return route.fulfill({ json: roi });
  });
  await page.route('**/*/tokens/prices', (route) => {
    return route.fulfill({ json: marketRate });
  });
  await page.route('**/*/market-rate?*', (route) => {
    const url = new URL(route.request().url());
    const address = url.searchParams.get('address') as keyof typeof marketRate;
    if (!address) throw new Error('No address found in the URL');
    const marketPrice = marketRate[address];
    // If unexpected behavior, let the real server handle that
    if (!address || !marketPrice) {
      return route.continue();
    }
    const data = {
      USD: marketPrice,
    };
    return route.fulfill({ json: { data } });
  });
  await page.route('**/*/history/prices?*', (route) => {
    const url = new URL(route.request().url());
    const { baseToken, quoteToken, start, end } = Object.fromEntries(
      url.searchParams.entries(),
    );
    const historyPricesId = [baseToken, quoteToken].join('-').toLowerCase();
    const data = (historyPrices as Record<string, PriceEntry[]>)[
      historyPricesId
    ];
    // If unexpected behavior, let the real server handle that
    if (!baseToken || !quoteToken || !start || !end || !data) {
      return route.continue();
    }
    return route.fulfill({ json: data });
  });
  await page.route('**/*/simulator/create?*', (route) => {
    const url = new URL(route.request().url());
    const {
      baseToken,
      quoteToken,
      buyMin,
      buyMax,
      buyMarginal = '0',
      buyBudget,
      sellMin,
      sellMax,
      sellMarginal = '0',
      sellBudget,
      start,
      end,
    } = Object.fromEntries(url.searchParams.entries());

    const keyValues = [
      baseToken.toLowerCase(),
      quoteToken.toLowerCase(),
      buyMin,
      buyMax,
      buyMarginal,
      buyBudget,
      sellMin,
      sellMax,
      sellMarginal,
      sellBudget,
      start,
      end,
    ];

    const simulateCreateStrategyId = keyValues.join('-');
    console.log(simulateCreateStrategyId);

    // If unexpected behavior, let the real server handle that
    if (
      keyValues.some((v) => !v) ||
      !(simulatorResult as SimulatorResult)[simulateCreateStrategyId]
    ) {
      throw new Error(`Could not access ${url} in mocked simulator result`);
    }

    const data = (simulatorResult as SimulatorResult)[simulateCreateStrategyId];
    return route.fulfill({ json: data });
  });
  // E2E should be allowed in production mode (CI)
  await page.route('/api/check', (route) => {
    return route.fulfill({ json: false });
  });

  await page.route('**/*/v1/activity?*', (route) => {
    return route.fulfill({ json: [] });
  });

  await page.route('**/*/v1/activity/meta?*', (route) => {
    return route.fulfill({ json: activityMeta });
  });

  const tokenListsToMock = Object.keys(tokenListsMock);
  tokenListsToMock.forEach(async (tokenList) => {
    await page.route(tokenList, (route) => {
      const json = (tokenListsMock as any)[tokenList];
      if (!json) return route.continue;
      return route.fulfill({ json });
    });
  });

  // Block Google tag manager before visiting page
  await page.route(/googletagmanager.com/, (route) => route.abort());

  // Block Sentry before visiting page
  await page.route(/sentry.io/, (route) => route.abort());
};
