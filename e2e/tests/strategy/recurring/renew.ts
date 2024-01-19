import { expect, test } from '@playwright/test';
import { pauseStrategy } from './pause';
import { NotificationDriver } from './../../../utils/NotificationDriver';
import {
  CreateStrategyTestCase,
  EditStrategyDriver,
} from '../../../utils/strategy';

export const renewStrategyTest = (testCase: CreateStrategyTestCase) => {
  return test('Renew', async ({ page }) => {
    const { strategy } = await pauseStrategy(page, testCase);

    await strategy.clickManageEntry('renewStrategy');
    const edit = new EditStrategyDriver(page, testCase);
    await edit.waitForPage('renew');
    await edit.fillRecurringPrice();
    await edit.submit('renew');
    await page.waitForURL('/', { timeout: 10_000 });

    const notifRenew = new NotificationDriver(page, 'renew-strategy');
    await expect(notifRenew.getTitle()).toHaveText('Success');
    await expect(notifRenew.getDescription()).toHaveText(
      'Your request to renew the strategy was successfully completed.'
    );

    await expect(strategy.status()).toHaveText('Active');
    // TODO Assert new prices from tooltips
  });
};
