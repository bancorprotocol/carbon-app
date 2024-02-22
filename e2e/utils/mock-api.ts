import { Page } from 'playwright-core';
import marketRate from '../mocks/market-rates.json';
import roi from '../mocks/roi.json';
import historyPrices from '../mocks/history-prices.json';
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
    const historyPricesId = _.join([baseToken, quoteToken, start, end], '-');
    // If unexpected behavior, let the real server handle that
    const data = historyPrices[historyPricesId];
    if (!baseToken || !quoteToken || !start || !end || !data) {
      return route.continue();
    }
    return route.fulfill({ json: { data } });
  });
  // E2E should be allowed in production mode (CI)
  await page.route('/api/check', (route) => {
    return route.fulfill({ json: false });
  });
};
