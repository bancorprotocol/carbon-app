import { test, expect } from '@playwright/test';

test('Strategy pause modal snapshot', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();

  await page.getByRole('button', { name: 'Manage' }).first().click();
  await page.getByRole('button', { name: 'Pause Strategy' }).first().click();
  await page
    .getByRole('button', { name: 'Create Strategy' })
    .first()
    .scrollIntoViewIfNeeded();

  await expect(page).toHaveScreenshot('strategy-pause.png');
});
