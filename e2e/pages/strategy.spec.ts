import { test, expect } from '@playwright/test';
import { screenshot } from '../utils/operators';
import { mockApi } from '../utils/mock-api';

test.describe('Strategies', () => {
  test.beforeEach(({ page }) => {
    mockApi(page);
  });
  test('First Strategy Page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('first-strategy').waitFor({ state: 'visible' });
    await screenshot(page, 'first-strategy');
  });

  test('Create Limit Strategy', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('create-strategy-desktop').click();

    // Select Base
    await page.getByTestId('select-base-token').click();
    await page.getByTestId('modal').waitFor({ state: 'visible' });
    await expect(page.getByTestId('filter-category-popular')).toHaveText(/12/);
    await expect(page.getByTestId('filter-category-all')).toHaveText(/4160/);
    // Test Clear input
    await page.getByLabel('Select Token').fill('eth');
    await page.getByTestId('clear-search').click();
    await expect(page.getByLabel('Select Token')).toHaveValue('');
    // Search
    await page.getByLabel('Select Token').fill('eth');
    await expect(page.getByTestId('filter-category-all')).toHaveText(/128/);
    await page.getByTestId('select-token-ETH').click();
    await page.getByTestId('modal').waitFor({ state: 'detached' });

    // Select Quote
    await page.getByTestId('select-quote-token').click();
    await page.getByTestId('modal').waitFor({ state: 'visible' });
    await page.getByLabel('Select Token').fill('dai');
    await page.getByTestId('select-token-DAI').click();

    await page.getByText('Next Step').click();
  });
});
