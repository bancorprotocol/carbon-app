import { Page } from 'playwright-core';
import marketRate from '../mocks/market-rates.json';
import roi from '../mocks/roi.json';

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
  // E2E should be allowed in production mode (CI)
  await page.route('/api/check', (route) => {
    return route.fulfill({ json: false });
  });
};
