import { Page } from '@playwright/test';
import { waitModalClose, waitModalOpen } from './modal';

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
