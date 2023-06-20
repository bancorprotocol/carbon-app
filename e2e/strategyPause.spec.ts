import { test, expect } from '@playwright/test';

test.describe('Pause strategy', () => {
  test.skip('Strategy pause modal snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Manage' }).first().click();
    await page.getByRole('button', { name: 'Pause Strategy' }).first().click();
    await page
      .getByRole('button', { name: 'Create Strategy' })
      .first()
      .scrollIntoViewIfNeeded();

    expect(await page.locator('#modal').screenshot()).toMatchSnapshot(
      'strategy-pause.png'
    );
  });

  test.skip('Strategy paused successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Manage' }).first().click();
    await page.getByRole('button', { name: 'Pause Strategy' }).first().click();

    const modal = await page.locator('#modal');
    await modal.getByRole('button', { name: 'Pause Strategy' }).first().click();

    await modal.waitFor({ state: 'detached' });
    await expect(page).toHaveScreenshot('strategy-pause-success.png');
  });
});
