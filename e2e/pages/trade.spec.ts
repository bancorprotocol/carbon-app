import { test, expect } from '@playwright/test';
import { navigateTo, waitFor } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/debug';

test.describe('Trade', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });
  test('Create Trade ETH->DAI', async ({ page }) => {
    test.setTimeout(120_000);
    await waitFor(page, 'balance-DAI', 20_000);
    await navigateTo(page, '/trade');

    // Select pair
    await page.getByTestId('select-trade-pair').click();
    await waitFor(page, 'modal-container');
    page.getByTestId('search-token-pair').fill('eth dai');
    // TODO: expect "all" is checked
    page.getByTestId('select-eth_dai').click();
    await page.getByTestId('modal-container').waitFor({ state: 'detached' });

    // Enter pay
    const buyForm = page.getByTestId('buy-form');
    await buyForm.getByLabel('You Pay').fill('100');
    await expect(buyForm.getByLabel('You Receive')).toHaveValue(
      '0.033646767200145424'
    );
  });
});
