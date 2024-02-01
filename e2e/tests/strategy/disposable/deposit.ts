import { expect, test } from '@playwright/test';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertDisposableTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
} from '../../../utils/strategy';

export const deposit = (testCase: CreateStrategyTestCase) => {
  assertDisposableTestCase(testCase);
  const { direction } = testCase;
  const output = testCase.output.deposit;
  return test('Deposit', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const strategy = await manage.createStrategy(testCase);
    await strategy.clickManageEntry('depositFunds');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('deposit');
    await edit.waitForWallet();
    await edit.fillDisposableBudget('deposit');

    await edit.submit('deposit');
    await page.waitForURL('/', { timeout: 20_000 });

    await expect(strategy.budget(direction)).toHaveText(output);
  });
};
