import { test } from '@playwright/test';
import { isCI, screenshot } from '../utils/operators';

test.describe('Strategies', () => {
  test('Screenshot page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('strategies-list').waitFor({ state: 'visible' });
    if (isCI) await screenshot(page, 'strategies');
  });
});
