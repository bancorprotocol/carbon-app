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
    await navigateTo(page, '/');
    await page.getByTestId('create-strategy-desktop').click();

    // Select Base
    await page.getByTestId('select-base-token').click();
    await waitFor(page, 'modal');
    // Search
    await page.getByLabel('Select Token').fill('eth');
    await page.getByTestId('select-token-ETH').click();
    await page.getByTestId('modal').waitFor({ state: 'detached' });

    // Select Quote
    await page.getByTestId('select-quote-token').click();
    await waitFor(page, 'modal');
    await page.getByLabel('Select Token').fill('dai');
    await page.getByTestId('select-token-DAI').click();
    await page.getByText('Next Step').click();

    await page.getByTestId('buy-input-limit').fill('1500');
    await page.getByTestId('buy-input-budget').fill('5000');
    await page.getByTestId('sell-input-limit').fill('1700');
    await page.getByTestId('sell-input-budget').fill('2');
    await page.getByText('Create Strategy').click();

    const approvalModal = await waitFor(page, 'modal');
    const ethMsg = approvalModal.getByTestId('msg-ETH');
    await expect(ethMsg).toHaveText('Pre-Approved');
    await approvalModal.getByTestId('approve-DAI').click();
    const daiApprovalMsg = await waitFor(page, 'msg-DAI');
    await expect(daiApprovalMsg).toHaveText('Approved');
    await approvalModal.getByText('Create Strategy').click();

    await page.waitForURL('/');

    // Verify data
    const strategies = page.locator('[data-testid="strategy-list"] > li');
    await expect(strategies).toHaveCount(1);
    const [strategy] = await strategies.all();
    await expect(strategy.getByTestId('token-pair')).toHaveText('ETH/DAI');
    await expect(strategy.getByTestId('status')).toHaveText('Active');
    await expect(strategy.getByTestId('buy-limit-price')).toHaveText('1,500');
    await expect(strategy.getByTestId('buy-limit-budget')).toHaveText('5,000');
    await expect(strategy.getByTestId('sell-limit-price')).toHaveText('1,700');
    await expect(strategy.getByTestId('sell-limit-budget')).toHaveText('2');

    // Verfiy notification
    const notif = page.getByTestId('notification-create-strategy');
    await expect(notif.getByTestId('notif-title')).toHaveText('Success');
    await expect(notif.getByTestId('notif-description')).toHaveText(
      'New strategy was successfully created.'
    );
  });
});
