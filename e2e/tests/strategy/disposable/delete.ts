import { expect, test } from '@playwright/test';
import {
  CreateStrategyTestCase,
  MyStrategyDriver,
} from './../../../utils/strategy';
import { waitModalOpen } from './../../../utils/modal';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';

export const deleteStrategyTest = (testCase: CreateStrategyTestCase) => {
  return test('Delete', async ({ page }) => {
    const { input } = testCase;
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(input);
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
