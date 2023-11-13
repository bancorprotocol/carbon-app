import { Page } from '@playwright/test';
import { waitModalClose, waitModalOpen } from '../modal';

/** Min & max should be equal for limit strategy */
interface PriceField {
  min: string;
  max: string;
  budget: string;
}

interface BaseConfig {
  base: string;
  quote: string;
}

export interface CreateStrategyConfig extends BaseConfig {
  type: 'recurring' | 'disposable';
  setting: 'limit' | 'range' | 'symmetric';
  buy: PriceField;
  sell: PriceField;
}

type Mode = 'buy' | 'sell';

export class CreateStrategyDriver {
  constructor(private page: Page, private config: CreateStrategyConfig) {}

  getLimitForm(mode: Mode) {
    const form = this.page.getByTestId(`${mode}-section`);
    return {
      limit: () => form.getByTestId('input-limit'),
      budget: () => form.getByTestId('input-budget'),
      outcomeValue: () => form.getByTestId('outcome-value'),
      outcomeQuote: () => form.getByTestId('outcome-quote'),
    };
  }

  getSymmetricForm() {
    const form = this.page.getByTestId('create-strategy-form');
    return {
      limit: () => form.getByTestId('input-limit'),
      budget: () => form.getByTestId('input-budget'),
      outcomeValue: () => form.getByTestId('outcome-value'),
      outcomeQuote: () => form.getByTestId('outcome-quote'),
    };
  }

  async selectToken(tokenType: 'base' | 'quote') {
    const token = this.config[tokenType];
    await this.page.getByTestId(`select-${tokenType}-token`).click();
    await waitModalOpen(this.page);
    await this.page.getByLabel('Select Token').fill(token);
    await this.page.getByTestId(`select-token-${token}`).click();
    await waitModalClose(this.page);
  }
  async fillLimit(mode: Mode) {
    const { min, budget } = this.config[mode];
    const form = this.getLimitForm(mode);
    await form.limit().fill(min);
    await form.budget().fill(budget);
    return form;
  }
  nextStep() {
    return this.page.getByText('Next Step').click();
  }
  submit() {
    return this.page.getByText('Create Strategy').click();
  }
}
