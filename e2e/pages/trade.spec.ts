/* eslint-disable prettier/prettier */
import { test, expect } from '@playwright/test';
import { navigateTo, waitFor } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/debug';
import { closeModal, waitModalClose, waitModalOpen } from '../utils/modal';

test.describe('Trade', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });
  test('Buy ETH with DAI', async ({ page }) => {
    test.setTimeout(120_000);
    await waitFor(page, 'balance-DAI', 20_000);
    await navigateTo(page, '/trade');

    const source = 'DAI';
    const target = 'ETH';

    // Select pair
    await page.getByTestId('select-trade-pair').click();
    await waitModalOpen(page);
    page.getByTestId('search-token-pair').fill(`${target} ${source}`);
    // TODO: expect "all" is checked
    const pair = await waitFor(page, `select-${target}_${source}`);
    await pair.click();
    await waitModalClose(page);

    // Enter pay
    const sourceValue = '100';
    const targetValue = '0.033646767200145424';
    const buyForm = page.getByTestId('buy-form');
    await buyForm.getByLabel('You Pay').fill(sourceValue);
    await expect(buyForm.getByLabel('You Receive')).toHaveValue(targetValue);

    // Verify routing
    await buyForm.getByTestId('routing').click();
    const modal = await waitFor(page, 'modal-container');
    await expect(modal.getByTestId('confirm-source')).toHaveValue(sourceValue);
    await expect(modal.getByTestId('confirm-target')).toHaveValue(targetValue);
    await closeModal(page);

    const submit = buyForm.getByTestId('submit');
    await submit.click();

    // Token approval
    const approvalModal = await waitModalOpen(page);
    await approvalModal.getByTestId(`approve-${source}`).click();
    const approvalMsg = await waitFor(page, `msg-${source}`);
    await expect(approvalMsg).toHaveText('Approved');
    await approvalModal.getByText('Confirm Trade').click();

    // Verify notification
    const notif = page.getByTestId('notification-trade');
    await expect(notif.getByTestId('notif-title')).toHaveText('Success');
    await expect(notif.getByTestId('notif-description')).toHaveText(
      `Trading ${sourceValue} ${source} for ${target} was successfully completed.`
    );

    // Verify form empty
    expect(buyForm.getByLabel('You Pay')).toHaveValue('');
    expect(buyForm.getByLabel('You Receive')).toHaveValue('');
  });
});
