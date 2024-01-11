import { expect, test } from '@playwright/test';
import { MyStrategyDriver } from './../../../utils/strategy';
import { waitModalOpen } from './../../../utils/modal';
import { CreateStrategyTemplate } from './../../../utils/strategy/template';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';

export const deleteStrategyTest = (testCase: CreateStrategyTemplate) => {
  return test('Delete', async ({ page }) => {
    test.setTimeout(45_000);

    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('manage-strategy-deleteStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('delete-strategy-btn').click();

    const notif = new NotificationDriver(page, 'delete-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Strategy was successfully deleted and all associated funds have been withdrawn to your wallet.'
    );

    const myStrategies = new MyStrategyDriver(page);
    const strategies = await myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(0);
  });
};
