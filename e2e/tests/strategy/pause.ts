import { expect, test } from '@playwright/test';
import { waitModalOpen } from './../../utils/modal';
import { Page } from 'playwright-core';
import { CreateStrategyTemplate } from './../../utils/strategy/template';
import { NotificationDriver } from './../../utils/NotificationDriver';
import { ManageStrategyDriver } from './../../utils/strategy/ManageStrategyDriver';

export const pauseStrategy = async (
  page: Page,
  config: CreateStrategyTemplate
) => {
  const manage = new ManageStrategyDriver(page);
  const strategy = await manage.createStrategy(config);
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

export const pauseStrategyTest = (config: CreateStrategyTemplate) => {
  return test('Pause', async ({ page }) => {
    test.setTimeout(45_000);
    await pauseStrategy(page, config);
  });
};
