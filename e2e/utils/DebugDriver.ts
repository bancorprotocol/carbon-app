import { Page } from '@playwright/test';
import { Wallet } from 'ethers';

interface ImposterConfig {
  /** Provide a default address, if not provided, we'll create one at random */
  address?: string;
  /** Won't need  */
  noMoney?: boolean;
}
export const setupImposter = async (
  page: Page,
  config: ImposterConfig = {}
) => {
  await page.goto('/debug');
  const address = config.address ?? Wallet.createRandom().address;
  await page.getByLabel('Imposter Account').fill(address);
  await page.getByTestId('save-imposter').click();
  if (!config.noMoney) {
    await page.getByText('Get money').click();
    // Note: we are not waiting for fund to arrive to speed up test.
    // Wait for it at the beginning of the test if it relies on fund right away
    // Example: await waitFor(page, 'balance-DAI');
  }
};

export class DebugDriver {
  constructor(private page: Page) {}

  getBalance(token: string) {
    return this.page.getByTestId(`balance-${token}`);
  }
}
