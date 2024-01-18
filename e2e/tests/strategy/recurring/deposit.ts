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
    await strategy.clickManageEntry('manage-strategy-depositFunds');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForEditPage('deposit');
    await edit.fillRecurringBudget('deposit');

    await edit.submit();
    await page.waitForURL('/', { timeout: 20_000 });

    const notif = new NotificationDriver(page, 'deposit-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your deposit request was successfully completed.'
    );

    await expect(strategy.buyBudget()).toHaveText(buy);
    await expect(strategy.sellBudget()).toHaveText(sell);
  });
};
