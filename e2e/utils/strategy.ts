import { test, expect, Page } from '@playwright/test';
import { checkApproval, waitModalClose, waitModalOpen } from './modal';
import { waitFor } from './operators';
import { navigateTo } from './operators';
import { NotificationDriver } from './notification';

interface LimitField {
  price: string;
  budget: string;
}

interface BaseConfig {
  base: string;
  quote: string;
}

interface LimitStrategyConfig extends BaseConfig {
  buy: LimitField;
  sell: LimitField;
}

type Mode = 'buy' | 'sell';

export class StrategyDriver {
  constructor(private page: Page, private config: LimitStrategyConfig) {}

  getLimitForm(mode: Mode) {
    const form = this.page.getByTestId(`${mode}-section`);
    return {
      limit: () => form.getByTestId('input-limit'),
      budget: () => form.getByTestId('input-budget'),
      outcomeValue: () => form.getByTestId('outcome-value'),
      outcomeQuote: () => form.getByTestId('outcome-quote'),
    };
  }

  async selectBase() {
    const { base } = this.config;
    await this.page.getByTestId('select-base-token').click();
    await waitModalOpen(this.page);
    await this.page.getByLabel('Select Token').fill(base);
    await this.page.getByTestId(`select-token-${base}`).click();
    await waitModalClose(this.page);
  }
  async selectQuote() {
    const { quote } = this.config;
    await this.page.getByTestId('select-quote-token').click();
    await waitModalOpen(this.page);
    await this.page.getByLabel('Select Token').fill(quote);
    await this.page.getByTestId(`select-token-${quote}`).click();
    await this.page.getByText('Next Step').click();
  }
  async fillLimit(mode: Mode) {
    const { price, budget } = this.config[mode];
    const form = this.getLimitForm(mode);
    await form.limit().fill(price);
    await form.budget().fill(budget);
    return form;
  }
  submit() {
    return this.page.getByText('Create Strategy').click();
  }
}

/** Generate a test that create a strategy */
export const testCreateLimitStrategy = (config: LimitStrategyConfig) => {
  const { base, quote } = config;
  return test(`Create Limit Strategy ${base}->${quote}`, async ({ page }) => {
    test.setTimeout(180_000);
    const { base, quote } = config;
    await waitFor(page, `balance-${quote}`, 30_000);

    await navigateTo(page, '/');
    const driver = new StrategyDriver(page, config);
    await page.getByTestId('create-strategy-desktop').click();
    await driver.selectBase();
    await driver.selectQuote();
    const buy = await driver.fillLimit('buy');
    const sell = await driver.fillLimit('sell');

    // Assert 100% outcome
    await expect(buy.outcomeValue()).toHaveText(`0.006666 ${base}`);
    await expect(buy.outcomeQuote()).toHaveText(`1,500 ${quote}`);
    await expect(sell.outcomeValue()).toHaveText(`3,400 ${quote}`);
    await expect(sell.outcomeQuote()).toHaveText(`1,700 ${quote}`);

    await driver.submit();

    await checkApproval(page, [base, quote]);

    await page.waitForURL('/', { timeout: 10_000 });

    // Verfiy notification
    const notif = new NotificationDriver(page, 'create-strategy');
    await expect(notif.getTitle()).toHaveText('Success');
    await expect(notif.getDescription()).toHaveText(
      'New strategy was successfully created.'
    );

    // Verify strategy data
    const strategies = page.locator('[data-testid="strategy-list"] > li');
    await strategies.waitFor({ state: 'visible' });
    await expect(strategies).toHaveCount(1);
    const [strategy] = await strategies.all();
    await expect(strategy.getByTestId('token-pair')).toHaveText(
      `${base}/${quote}`
    );
    await expect(strategy.getByTestId('status')).toHaveText('Active');
    await expect(strategy.getByTestId('total-budget')).toHaveText('$3,344');
    await expect(strategy.getByTestId('buy-budget')).toHaveText(`10 ${quote}`);
    await expect(strategy.getByTestId('buy-budget-fiat')).toHaveText('$10.00');
    await expect(strategy.getByTestId('sell-budget-fiat')).toHaveText('$3,334');
  });
};
