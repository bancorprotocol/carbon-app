import { expect, test } from '@playwright/test';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertRecurringTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
} from '../../../utils/strategy';

export const depositStrategyTest = (testCase: CreateStrategyTestCase) => {
  assertRecurringTestCase(testCase);
  const { buy, sell } = testCase.output.deposit;
  return test('Deposit', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('depositFunds');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('deposit');
    await edit.fillRecurringBudget('deposit');

    await edit.submit('deposit');
    await page.waitForURL('/', { timeout: 20_000 });

    const notificationDriver = new NotificationDriver(page);
    const notif = notificationDriver.getNotification('deposit-strategy');
    await expect(notif.title()).toHaveText('Success');
    await expect(notif.description()).toHaveText(
      'Your deposit request was successfully completed.'
    );

    await expect(strategy.budget('buy')).toHaveText(buy);
    await expect(strategy.budget('sell')).toHaveText(sell);
  });
};
