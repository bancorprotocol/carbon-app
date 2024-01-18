import { expect, test } from '@playwright/test';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  CreateStrategyTestCase,
  EditStrategyDriver,
} from '../../../utils/strategy';

export const editPriceStrategyTest = (testCase: CreateStrategyTestCase) => {
  return test('Edit Price', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('manage-strategy-editPrices');

    await manage.waitForEditPage('editPrices');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.fillRecurring();
    await page.getByTestId('edit-strategy-prices-submit').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const notif = new NotificationDriver(page, 'change-rates-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'Your strategy was successfully updated.'
    );

    // TODO Assert new prices from tooltips
  });
};
