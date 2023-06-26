import { expect } from '@playwright/test';
import { test } from './fixture';

test.describe('Delete strategy', () => {
  test('Strategy delete modal snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Manage' }).first().click();
    await page.getByRole('button', { name: 'Delete Strategy' }).first().click();
    const deleteStrategyModal = await page.getByTestId('modal');
    await deleteStrategyModal.waitFor({ state: 'visible' });
    expect(await deleteStrategyModal.screenshot()).toMatchSnapshot(
      'strategy-delete.png'
    );
  });

  test('Strategy deleted successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Manage' }).first().click();
    await page.getByRole('button', { name: 'Delete Strategy' }).first().click();

    const deleteStrategyModal = await page.getByTestId('modal');
    await deleteStrategyModal
      .getByRole('button', { name: 'Delete Strategy' })
      .first()
      .click();
    await deleteStrategyModal.waitFor({ state: 'detached' });
    const strategies = await page.getByText('1 Strategies');
    await expect(strategies).toBeVisible();
  });
});
