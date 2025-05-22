import { expect, test } from '@playwright/test';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertOverlappingTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';

export const withdraw = (testCase: CreateStrategyTestCase) => {
  assertOverlappingTestCase(testCase);
  return test('Withdraw', async ({ page }) => {
    const { base, quote } = testCase;
    const input = testCase.input.withdraw;
    const output = testCase.output.withdraw;
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const initial = await manage.createStrategy(testCase, { tokenApproval });
    await initial.clickManageEntry('withdrawFunds');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('overlapping', 'withdraw');
    const form = edit.getOverlappingForm();
    await form.anchor(input.anchor).click();
    await form.budget().focus();
    await form.budget().fill(input.budget);
    await edit.submit('withdraw');

    await tokenApproval.checkApproval([base, quote]);
    await page.waitForURL('/portfolio', { timeout: 10_000 });
    await page.mouse.move(0, 0); // Prevent mouse to open tooltip

    // Verify strategy data
    const myStrategies = new MyStrategyDriver(page);
    await myStrategies.waitForUpdates();
    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(1);
    const strategy = await myStrategies.getStrategy(1);
    await expect(strategy.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategy.status()).toHaveText('Active');
    await expect(strategy.budget('buy')).toHaveText(output.buy);
    await expect(strategy.budget('sell')).toHaveText(output.sell);
  });
};
