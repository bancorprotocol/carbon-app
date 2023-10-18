/* eslint-disable prettier/prettier */
import { test, expect } from '@playwright/test';
import { navigateTo, screenshot, waitFor } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/debug';
import { waitModalClose, waitModalOpen } from '../utils/modal';

test.describe('Strategies', () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all([mockApi(page), setupImposter(page)]);
  });
  test('First Strategy Page', async ({ page }) => {
    await navigateTo(page, '/');
    await page.getByTestId('first-strategy').waitFor({ state: 'visible' });
    await screenshot(page, 'first-strategy');
  });

  test('Create Limit Strategy ETH->DAI', async ({ page }) => {
    test.setTimeout(120_000);
    const base = 'ETH';
    const quote = 'DAI';

    await waitFor(page, `balance-${quote}`, 20_000);

    await navigateTo(page, '/');
    await page.getByTestId('create-strategy-desktop').click();

    // Select Base
    await page.getByTestId('select-base-token').click();
    await waitModalOpen(page);
    await page.getByLabel('Select Token').fill('eth');
    await page.getByTestId(`select-token-${base}`).click();
    await waitModalClose(page);

    // Select Quote
    await page.getByTestId('select-quote-token').click();
    await waitModalOpen(page);
    await page.getByLabel('Select Token').fill('dai');
    await page.getByTestId(`select-token-${quote}`).click();
    await page.getByText('Next Step').click();

    // Fill Buy fields
    const buy = page.getByTestId('buy-section');
    await buy.getByTestId('input-limit').fill('1500');
    await buy.getByTestId('input-budget').fill('10');
    await expect(buy.getByTestId('outcome-value')).toHaveText(
      `0.006666 ${base}`
    );
    await expect(buy.getByTestId('outcome-quote')).toHaveText(`1,500 ${quote}`);

    // Fill Sell fields
    const sell = page.getByTestId('sell-section');
    await sell.getByTestId('input-limit').fill('1700');
    await sell.getByTestId('input-budget').fill('2');
    await expect(sell.getByTestId('outcome-value')).toHaveText(
      `3,400 ${quote}`
    );
    await expect(sell.getByTestId('outcome-quote')).toHaveText(
      `1,700 ${quote}`
    );

    await page.getByText('Create Strategy').click();

    // Accept approval
    const approvalModal = await waitFor(page, 'approval-modal');
    const ethMsg = approvalModal.getByTestId(`msg-${base}`);
    await expect(ethMsg).toHaveText('Pre-Approved');
    await approvalModal.getByTestId(`approve-${quote}`).click();
    const daiApprovalMsg = await waitFor(page, `msg-${quote}`);
    await expect(daiApprovalMsg).toHaveText('Approved');
    await approvalModal.getByText('Create Strategy').click();

    await page.waitForURL('/', { timeout: 10_000 });

    // Verfiy notification
    const notif = page.getByTestId('notification-create-strategy');
    await expect(notif.getByTestId('notif-title')).toHaveText('Success');
    await expect(notif.getByTestId('notif-description')).toHaveText(
      'New strategy was successfully created.'
    );

    // Verify strategy data
    const strategies = page.locator('[data-testid="strategy-list"] > li');
    await strategies.waitFor({ state: 'visible' });
    await expect(strategies).toHaveCount(1);
    const [strategy] = await strategies.all();
    await expect(strategy.getByTestId('token-pair')).toHaveText(
      `${base}/${quote}`
    );
    await expect(strategy.getByTestId('status')).toHaveText('Active');
    await expect(strategy.getByTestId('total-budget')).toHaveText('$3,344');
    await expect(strategy.getByTestId('buy-budget')).toHaveText(`10 ${quote}`);
    await expect(strategy.getByTestId('buy-budget-fiat')).toHaveText('$10.00');
    await expect(strategy.getByTestId('sell-budget-fiat')).toHaveText('$3,334');
  });
});
