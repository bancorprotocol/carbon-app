import { Page } from 'playwright-core';
import marketRate from '../mocks/market-rates.json';
import roi from '../mocks/roi.json';
import historyPrices from '../mocks/history-prices.json';
import simulatorResult from '../mocks/simulator-result.json';
import _ from 'lodash';

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
    const baseToken = url.searchParams.get('baseToken')?.toLowerCase();
    const quoteToken = url.searchParams.get('quoteToken')?.toLowerCase();
    const start = url.searchParams.get('start')?.toLowerCase();
    const end = url.searchParams.get('end')?.toLowerCase();
    const historyPricesId = _.join([baseToken, quoteToken], '-');
    const data = historyPrices[historyPricesId];
    // If unexpected behavior, let the real server handle that
    if (!baseToken || !quoteToken || !start || !end || !data) {
      return route.continue();
    }
    return route.fulfill({ json: { data } });
  });
  await page.route('**/*/simulate-create-strategy?*', (route) => {
    const url = new URL(route.request().url());
    const baseToken = url.searchParams.get('baseToken')?.toLowerCase();
    const quoteToken = url.searchParams.get('quoteToken')?.toLowerCase();
    const buyIsRange = url.searchParams.get('buyIsRange');
    const buyMin = url.searchParams.get('buyMin');
    const buyMax = url.searchParams.get('buyMax');
    const sellIsRange = url.searchParams.get('sellIsRange');
    const sellMin = url.searchParams.get('sellMin');
    const sellMax = url.searchParams.get('sellMax');
    const baseBudget = url.searchParams.get('buyBudget');
    const quoteBudget = url.searchParams.get('sellBudget');
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    const simulateCreateStrategyId = _.join(
      [
        baseToken,
        quoteToken,
        buyMin,
        buyMax,
        sellMin,
        sellMax,
        baseBudget,
        quoteBudget,
      ],
      '-'
    );

    // If unexpected behavior, let the real server handle that
    if (
      !baseToken ||
      !quoteToken ||
      !buyIsRange ||
      !buyMin ||
      !buyMax ||
      !sellIsRange ||
      !sellMin ||
      !sellMax ||
      !baseBudget ||
      !quoteBudget ||
      !start ||
      !end ||
      !simulatorResult[simulateCreateStrategyId]
    ) {
      return route.continue();
    }
    const data = simulatorResult[simulateCreateStrategyId];
    return route.fulfill({ json: { data } });
  });
  // E2E should be allowed in production mode (CI)
  await page.route('/api/check', (route) => {
    return route.fulfill({ json: false });
  });
};
