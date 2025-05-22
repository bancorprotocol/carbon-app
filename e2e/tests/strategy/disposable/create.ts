import { expect, test } from '@playwright/test';
import { NotificationDriver } from '../../../utils/NotificationDriver';
import { navigateTo, screenshot, waitFor } from '../../../utils/operators';
import {
  CreateStrategyDriver,
  CreateStrategyTestCase,
  MyStrategyDriver,
  assertDisposableTestCase,
  screenshotPath,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';
import { waitForTenderlyRpc } from '../../../utils/tenderly';

export const create = (testCase: CreateStrategyTestCase) => {
  assertDisposableTestCase(testCase);
  const { base, quote, direction, setting } = testCase;
  const output = testCase.output.create;

  return test(`Create`, async ({ page }) => {
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/portfolio');
    const myStrategies = new MyStrategyDriver(page);
    const createForm = new CreateStrategyDriver(page, testCase);
    await myStrategies.createStrategy();
    await createForm.selectToken('base');
    await createForm.selectToken('quote');
    await createForm.selectSetting('disposable');

    const form = await createForm.fillDisposable();

    // Assert 100% outcome
    await expect(form.outcomeValue()).toHaveText(output.outcomeValue);
    await expect(form.outcomeQuote()).toHaveText(output.outcomeQuote);

    await createForm.submit('create');

    const tokenApproval = new TokenApprovalDriver(page);
    if (direction === 'buy') {
      await tokenApproval.checkApproval([quote]);
    } else {
      await tokenApproval.checkApproval([base]);
    }

    await page.waitForURL('/portfolio', { timeout: 10_000 });
    await myStrategies.waitForUpdates();
    await waitForTenderlyRpc(page);
    // Verify strategy data
    const strategies = myStrategies.getAllStrategies();
    await expect(strategies).toHaveCount(1);
    const strategy = await myStrategies.getStrategy(1);
    await expect(strategy.pair()).toHaveText(`${base}/${quote}`);
    await expect(strategy.status()).toHaveText('Active');
    await expect(strategy.totalBudget()).toHaveText(output.fiat);
    await expect(strategy.budget(direction)).toHaveText(output.budget);
    await expect(strategy.budgetFiat(direction)).toHaveText(output.fiat);

    const tooltip = await strategy.priceTooltip(direction);
    if (setting === 'limit') {
      await expect(tooltip.price()).toHaveText(output.min);
    } else {
      await expect(tooltip.minPrice()).toHaveText(output.min);
      await expect(tooltip.maxPrice()).toHaveText(output.max);
    }
    await tooltip.waitForDetached();

    const notificationDriver = new NotificationDriver(page);
    await notificationDriver.closeAll();

    await screenshot(page, screenshotPath(testCase, 'create', 'my-strategy'));
  });
};
