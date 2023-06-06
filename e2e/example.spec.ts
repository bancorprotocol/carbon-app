import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Carbon/);
});

test('Trade', async ({ page }) => {
  await page.goto(`${page}/`, { waitUntil: 'networkidle' });
  const element = await page.getByText('Network Error');
  await expect(element !== undefined).toBeTruthy();
});
