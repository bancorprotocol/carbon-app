import { expect, test } from '@playwright/test';
import {
  CreateStrategyTestCase,
  MyStrategyDriver,
} from './../../../utils/strategy';
import { waitModalOpen } from './../../../utils/modal';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';

export const deleteStrategy = (testCase: CreateStrategyTestCase) => {
  return test('Delete', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('deleteStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('delete-strategy-btn').click();
    await modal.waitFor({ state: 'detached' });

    const myStrategies = new MyStrategyDriver(page);
    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(0);
  });
};
