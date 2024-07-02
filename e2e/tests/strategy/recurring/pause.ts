import { expect, test } from '@playwright/test';
import { waitModalOpen } from './../../../utils/modal';
import { Page } from 'playwright-core';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  CreateStrategyTestCase,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';

export const pauseStrategy = async (
  page: Page,
  testCase: CreateStrategyTestCase
) => {
  const manage = new ManageStrategyDriver(page);
  const tokenApproval = new TokenApprovalDriver(page);
  const strategy = await manage.createStrategy(testCase, { tokenApproval });
  await strategy.clickManageEntry('pauseStrategy');

  const modal = await waitModalOpen(page);
  await modal.getByTestId('pause-strategy-btn').click();
  await modal.waitFor({ state: 'detached' });

  const myStrategies = new MyStrategyDriver(page);
  await myStrategies.waitForUpdates();

  await expect(strategy.status()).toHaveText('Inactive');

  return { strategy, manage };
};

export const pauseStrategyTest = (testCase: CreateStrategyTestCase) => {
  return test('Pause', async ({ page }) => {
    await pauseStrategy(page, testCase);
  });
};
