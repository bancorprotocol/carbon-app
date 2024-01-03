import { Page } from '@playwright/test';
import { Wallet } from 'ethers';
import { checkApproval } from './modal';

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

type DebugTokens =
  | 'USDC'
  | 'DAI'
  | 'BNT'
  | 'PARQ'
  | 'WBTC'
  | 'BNB'
  | 'MATIC'
  | 'SHIB'
  | 'UNI'
  | 'USDT'
  | 'ETH';

interface CreateStrategyTemplate {
  base: DebugTokens;
  quote: DebugTokens;
  buy: {
    min: string;
    max: string;
    budget: string;
  };
  sell: {
    min: string;
    max: string;
    budget: string;
  };
  amount?: string;
}

export class DebugDriver {
  constructor(private page: Page) {}

  getBalance(token: string) {
    return this.page.getByTestId(`balance-${token}`);
  }

  async createStrategy(template: CreateStrategyTemplate) {
    const { base, quote, buy, sell, amount } = template;
    await this.page.getByTestId(`token-${base}`).click();
    await this.page.getByTestId(`token-${quote}`).click();
    await this.page.getByTestId('buyMin').fill(buy.min);
    await this.page.getByTestId('buyMax').fill(buy.max);
    await this.page.getByTestId('buyBudget').fill(buy.budget);
    await this.page.getByTestId('sellMin').fill(sell.min);
    await this.page.getByTestId('sellMax').fill(sell.max);
    await this.page.getByTestId('sellBudget').fill(sell.budget);
    await this.page.getByTestId('strategy-amount').fill(amount ?? '1');
    await this.page.getByTestId('create-strategies').click();
    await checkApproval(this.page, [base, quote]);
    await this.page.getByTestId('creating-strategies').waitFor({
      state: 'detached',
    });
  }
}
