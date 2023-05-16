import { test, expect } from '@playwright/test';

test('Strategy delete modal snapshot', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();

  await page.getByRole('button', { name: 'Manage' }).first().click();
  await page.getByRole('button', { name: 'Delete Strategy' }).first().click();

  await expect(page).toHaveScreenshot('strategy-delete.png');
});
