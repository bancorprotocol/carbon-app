import { Page } from '@playwright/test';
import { Wallet } from 'ethers';
import { checkApproval } from './modal';
import { CreateStrategyTemplate } from './strategy/template';

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

  async createStrategy(template: CreateStrategyTemplate) {
    const { base, quote, buy, sell, spread, amount } = template;
    // TODO: use textarea shortcut instead of filling each field.
    // Currently this revert with Dai/insufficient-allowance for some reason
    // await this.page.getByTestId('strategy-json-shortcut').fill(JSON.stringify(template));
    await this.page.getByTestId(`token-${base}`).click();
    await this.page.getByTestId(`token-${quote}`).click();
    await this.page.getByTestId('buyMin').fill(buy.min);
    await this.page.getByTestId('buyMax').fill(buy.max);
    await this.page.getByTestId('buyBudget').fill(buy.budget);
    await this.page.getByTestId('sellMin').fill(sell.min);
    await this.page.getByTestId('sellMax').fill(sell.max);
    await this.page.getByTestId('sellBudget').fill(sell.budget);
    await this.page.getByTestId('strategy-amount').fill(amount ?? '1');
    await this.page.getByTestId('spread').fill(spread ?? '');
    await this.page.getByTestId('create-strategies').click();
    await checkApproval(this.page, [base, quote]);
    await this.page.getByTestId('creating-strategies').waitFor({
      state: 'detached',
    });
  }
}
