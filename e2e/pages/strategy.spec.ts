import { test } from '@playwright/test';
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
});
