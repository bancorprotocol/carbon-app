import { expect, test } from '@playwright/test';
import { waitModalOpen } from './../../../utils/modal';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertRecurringTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
} from '../../../utils/strategy';

export const withdrawStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { buy, sell } = testCase.output.withdraw;
  return test('Withdraw', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('withdrawFunds');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('withdraw-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('withdraw');
    await edit.fillRecurringBudget('withdraw');

    await edit.submit('withdraw');
    await page.waitForURL('/', { timeout: 20_000 });

    const notificationDriver = new NotificationDriver(page);
    const notif = notificationDriver.getNotification('withdraw-strategy');
    await expect(notif.title()).toHaveText('Success');
    await expect(notif.description()).toHaveText(
      'Your withdrawal request was successfully completed.'
    );

    await expect(strategy.budget('buy')).toHaveText(buy);
    await expect(strategy.budget('sell')).toHaveText(sell);
  });
};
