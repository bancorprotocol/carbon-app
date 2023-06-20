import { test, expect } from '@playwright/test';

test.describe('Delete strategy', () => {
  test('Strategy delete modal snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Manage' }).first().click();
    await page.getByRole('button', { name: 'Delete Strategy' }).first().click();

    expect(await page.locator('#modal').screenshot()).toMatchSnapshot(
      'strategy-delete.png'
    );
  });

  test.skip('Strategy deleted successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Manage' }).first().click();
    await page.getByRole('button', { name: 'Delete Strategy' }).first().click();

    const modal = await page.locator('#modal');
    await modal
      .getByRole('button', { name: 'Delete Strategy' })
      .first()
      .click();

    await modal.waitFor({ state: 'detached' });
    await expect(page).toHaveScreenshot('strategy-delete-success.png');
  });
});
