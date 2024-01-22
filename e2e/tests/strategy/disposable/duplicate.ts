import { expect, test } from '@playwright/test';
import {
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertDisposableTestCase,
} from './../../../utils/strategy';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { waitModalOpen } from '../../../utils/modal';

export const duplicate = (testCase: CreateStrategyTestCase) => {
  assertDisposableTestCase(testCase);
  const { base, quote, direction, setting } = testCase;
  const output = testCase.output.create;

  return test('Duplicate', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('duplicateStrategy');

    const modal = await waitModalOpen(page);
    await modal.getByTestId('duplicate-strategy-btn').click();

    await page.waitForURL('/strategies/create?strategy=*', {
      timeout: 10_000,
    });

    await page.getByText('Create Strategy').click();
    await page.waitForURL('/', { timeout: 10_000 });

    const myStrategies = new MyStrategyDriver(page);
    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(2);

    const duplicate = await myStrategies.getStrategy(2);
    await expect(duplicate.pair()).toHaveText(`${base}/${quote}`);
    await expect(duplicate.status()).toHaveText('Active');
    await expect(duplicate.totalBudget()).toHaveText(output.fiat);
    await expect(duplicate.budget(direction)).toHaveText(output.budget);
    await expect(duplicate.budgetFiat(direction)).toHaveText(output.fiat);

    const tooltip = await duplicate.priceTooltip(direction);
    if (setting === 'limit') {
      expect(tooltip.price()).toHaveText(output.min);
    } else {
      expect(tooltip.minPrice()).toHaveText(output.min);
      expect(tooltip.maxPrice()).toHaveText(output.max);
    }
    await tooltip.waitForDetached();

    const notificationDriver = new NotificationDriver(page);
    const notif = notificationDriver.getNotification('create-strategy');
    await expect(notif.title()).toHaveText('Success');
    await expect(notif.description()).toHaveText(
      'New strategy was successfully created.'
    );
  });
};
