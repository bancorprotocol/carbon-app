import { expect } from '@playwright/test';
import { cleanForkTest } from './fixture';

cleanForkTest.describe('Delete strategy', () => {
  cleanForkTest('Strategy delete modal snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Manage' }).first().click();
    await page.getByRole('button', { name: 'Delete Strategy' }).first().click();
    const deleteStrategyModal = await page.getByTestId('modal');

    expect(await deleteStrategyModal.screenshot()).toMatchSnapshot(
      'strategy-delete.png'
    );
  });

  cleanForkTest('Strategy deleted successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Manage' }).first().click();
    await page.getByRole('button', { name: 'Delete Strategy' }).first().click();

    const deleteStrategyModal = await page.getByTestId('modal');
    await deleteStrategyModal
      .getByRole('button', { name: 'Delete Strategy' })
      .first()
      .click();

    const strategies = await page.getByText('2 Strategies');
    await expect(strategies).toBeVisible();
  });
});
