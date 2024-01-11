import { expect, test } from '@playwright/test';
import { waitModalOpen } from './../../../utils/modal';
import { Page } from 'playwright-core';
import { CreateStrategyTemplate } from './../../../utils/strategy/template';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';

export const pauseStrategy = async (
  page: Page,
  testCase: CreateStrategyTemplate
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

export const pauseStrategyTest = (testCase: CreateStrategyTemplate) => {
  return test('Pause', async ({ page }) => {
    await pauseStrategy(page, testCase);
  });
};
