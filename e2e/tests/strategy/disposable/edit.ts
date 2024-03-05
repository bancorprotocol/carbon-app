import { expect, test } from '@playwright/test';
import { ManageStrategyDriver } from './../../../utils/strategy/ManageStrategyDriver';
import {
  assertDisposableTestCase,
  CreateStrategyTestCase,
  EditStrategyDriver,
} from '../../../utils/strategy';
import { TokenApprovalDriver } from '../../../utils/TokenApprovalDriver';

export const editPrice = (testCase: CreateStrategyTestCase) => {
  assertDisposableTestCase(testCase);
  const { direction, setting } = testCase;
  const output = testCase.output.editPrice;
  return test('Edit Price', async ({ page }) => {
    const manage = new ManageStrategyDriver(page);
    const tokenApproval = new TokenApprovalDriver(page);
    const strategy = await manage.createStrategy(testCase, { tokenApproval });
    await strategy.clickManageEntry('editPrices');

    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('editPrices');
    await edit.fillDisposablePrice('editPrices');

    await edit.submit('editPrices');
    await page.waitForURL('/', { timeout: 10_000 });

    const tooltip = await strategy.priceTooltip(direction);
    if (setting === 'limit') {
      expect(tooltip.price()).toHaveText(output.min);
    } else {
      expect(tooltip.minPrice()).toHaveText(output.min);
      expect(tooltip.maxPrice()).toHaveText(output.max);
    }
  });
};
