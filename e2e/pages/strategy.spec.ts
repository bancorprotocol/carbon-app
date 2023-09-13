import { test } from '@playwright/test';
import { screenshot } from '../utils/operators';

test.describe('Strategies', () => {
  test('First Strategy Page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('strategies-list').waitFor({ state: 'visible' });
    await screenshot(page, 'first-strategy');
  });
});
