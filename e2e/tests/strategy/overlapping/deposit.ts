import { expect, test } from '@playwright/test';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertOverlappingTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
  MyStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';

export const deposit = (testCase: CreateStrategyTestCase) => {
  assertOverlappingTestCase(testCase);
  return test('Deposit', async ({ page }) => {
    const { base, quote } = testCase;
    const input = testCase.input.deposit;
    const output = testCase.output.deposit;
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const initial = await manage.createStrategy(testCase, { tokenApproval });
    await initial.clickManageEntry('depositFunds');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('overlapping', 'deposit');
    const form = edit.getOverlappingForm();
    await form.anchor(input.anchor).click();
    await form.budget().focus();
    await form.budget().fill(input.budget);
    await edit.submit('deposit');

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
