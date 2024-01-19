import { expect, test } from '@playwright/test';
import { waitModalOpen } from './../../../utils/modal';
import { Page } from 'playwright-core';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import { CreateStrategyTestCase } from '../../../utils/strategy';

export const pauseStrategy = async (
  page: Page,
  testCase: CreateStrategyTestCase
) => {
  const manage = new ManageStrategyDriver(page);
  const strategy = await manage.createStrategy(testCase);
  await strategy.clickManageEntry('manage-strategy-pauseStrategy');

  const modal = await waitModalOpen(page);
  await modal.getByTestId('pause-strategy-btn').click();

  const notif = new NotificationDriver(page, 'pause-strategy');
  await expect(notif.getTitle()).toHaveText('Success');
  await expect(notif.getDescription()).toHaveText(
    'Your strategy was successfully paused.'
  );

  await expect(strategy.status()).toHaveText('Inactive');

  return { strategy, manage };
};

export const pauseStrategyTest = (testCase: CreateStrategyTestCase) => {
  return test('Pause', async ({ page }) => {
    await pauseStrategy(page, testCase);
  });
};
