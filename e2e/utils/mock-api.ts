import { Page } from 'playwright-core';
import marketRate from '../mocks/market-rates.json';
import roi from '../mocks/roi.json';
import historyPrices from '../mocks/history-prices.json';
import simulatorResult from '../mocks/simulator-result.json';
import tokenListsMock from '../mocks/tokenLists.json';

export const mockApi = async (page: Page) => {
  await page.route('**/*/roi', (route) => {
    return route.fulfill({ json: roi });
  });
  await page.route('**/*/market-rate?*', (route) => {
    const url = new URL(route.request().url());
    const address = url.searchParams.get('address')?.toLowerCase();
    const currencies = url.searchParams.get('convert')?.split(',');
    // If unexpected behavior, let the real server handle that
    if (!address || !currencies || !marketRate[address]) {
      return route.continue();
    }
    const data = {};
    for (const currency of currencies) {
      data[currency] = marketRate[address][currency];
    }
    return route.fulfill({ json: { data } });
  });
  await page.route('**/*/history/prices?*', (route) => {
    const url = new URL(route.request().url());
    const { baseToken, quoteToken, start, end } = Object.fromEntries(
      url.searchParams.entries()
    );
    const historyPricesId = [baseToken, quoteToken].join('-').toLowerCase();
    const data = historyPrices[historyPricesId];
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
      buyMarginal,
      buyBudget,
      sellMin,
      sellMax,
      sellMarginal,
      sellBudget,
      start,
      end,
    } = Object.fromEntries(url.searchParams.entries());

    const keyValues = [
      baseToken,
      quoteToken,
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

    // If unexpected behavior, let the real server handle that
    if (
      keyValues.some((v) => !v) ||
      !simulatorResult[simulateCreateStrategyId]
    ) {
      throw new Error(`Could not access ${url} in mocked simulator result`);
    }

    const data = simulatorResult[simulateCreateStrategyId];
    return route.fulfill({ json: data });
  });
  // E2E should be allowed in production mode (CI)
  await page.route('/api/check', (route) => {
    return route.fulfill({ json: false });
  });

  await page.route('**/*/v1/activity?*', (route) => {
    return route.fulfill({ json: [] });
  });

  const tokenListsToMock = Object.keys(tokenListsMock);
  tokenListsToMock.forEach(async (tokenList) => {
    await page.route(tokenList, (route) => {
      const json = tokenListsMock[tokenList];
      if (!json) return route.continue;
      return route.fulfill({ json });
    });
  });

  // Block Google tag manager before visiting page
  await page.route(/googletagmanager.com/, (route) => route.abort());

  // Block Sentry before visiting page
  await page.route(/sentry.io/, (route) => route.abort());
};
