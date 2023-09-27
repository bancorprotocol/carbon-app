import { test, expect } from '@playwright/test';
import { navigateTo, screenshot, waitFor } from '../utils/operators';
import { mockApi } from '../utils/mock-api';
import { setupImposter } from '../utils/debug';

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
    test.setTimeout(60_000);
    await waitFor(page, 'balance-DAI', 20_000);

    await navigateTo(page, '/');
    await page.getByTestId('create-strategy-desktop').click();

    // Select Base
    await page.getByTestId('select-base-token').click();
    await waitFor(page, 'modal-container');
    await page.getByLabel('Select Token').fill('eth');
    await page.getByTestId('select-token-ETH').click();
    await page.getByTestId('modal-container').waitFor({ state: 'detached' });

    // Select Quote
    await page.getByTestId('select-quote-token').click();
    await waitFor(page, 'modal-container');
    await page.getByLabel('Select Token').fill('dai');
    await page.getByTestId('select-token-DAI').click();
    await page.getByText('Next Step').click();

    // Fill Buy fields
    const buy = page.getByTestId('buy-section');
    await buy.getByTestId('input-limit').fill('1500');
    await buy.getByTestId('input-budget').fill('5000');
    await expect(buy.getByTestId('outcome-value')).toHaveText('3.33 ETH');
    await expect(buy.getByTestId('outcome-quote')).toHaveText('1,500 DAI');

    // Fill Sell fields
    const sell = page.getByTestId('sell-section');
    await sell.getByTestId('input-limit').fill('1700');
    await sell.getByTestId('input-budget').fill('2');
    await expect(sell.getByTestId('outcome-value')).toHaveText('3,400 DAI');
    await expect(sell.getByTestId('outcome-quote')).toHaveText('1,700 DAI');

    await page.getByText('Create Strategy').click();

    // Accept approval
    const approvalModal = await waitFor(page, 'approval-modal');
    const ethMsg = approvalModal.getByTestId('msg-ETH');
    await expect(ethMsg).toHaveText('Pre-Approved');
    await approvalModal.getByTestId('approve-DAI').click();
    const daiApprovalMsg = await waitFor(page, 'msg-DAI');
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
    await expect(strategy.getByTestId('token-pair')).toHaveText('ETH/DAI');
    await expect(strategy.getByTestId('status')).toHaveText('Active');
    await expect(strategy.getByTestId('buy-limit-price')).toHaveText('1,500');
    await expect(strategy.getByTestId('buy-limit-budget')).toHaveText('5,000');
    await expect(strategy.getByTestId('sell-limit-price')).toHaveText('1,700');
    await expect(strategy.getByTestId('sell-limit-budget')).toHaveText('2');
  });
});
