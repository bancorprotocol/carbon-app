import { Page } from '@playwright/test';
import { waitModalClose, waitModalOpen } from '../modal';

/** Min & max should be equal for limit strategy */
interface PriceField {
  min: string;
  max: string;
  budget: string;
  budgetFiat: string;
}

interface BaseConfig {
  base: string;
  quote: string;
  totalBudget: string;
  type: StrategyType;
  setting: 'limit' | 'range' | 'symmetric';
  buy: PriceField;
  sell: PriceField;
}

export interface LimiStrategyConfig extends BaseConfig {
  type: 'recurring';
  setting: 'limit';
}
export interface SymmetricStrategyConfig extends BaseConfig {
  type: 'recurring';
  setting: 'symmetric';
  spread: string;
}

export type CreateStrategyConfig = LimiStrategyConfig | SymmetricStrategyConfig;

type Mode = 'buy' | 'sell';
type StrategyType = 'recurring' | 'disposable';
type StrategySettings =
  | 'two-limits'
  | 'two-ranges'
  | 'symmetric'
  | `${Mode}-range`
  | `${Mode}-limit`;

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
      min: () => form.getByLabel('Min Buy Price'),
      max: () => form.getByLabel('Max Sell Price'),
      budgetBase: () => form.getByTestId(`input-budget-${this.config.base}`),
      budgetQuote: () => form.getByTestId(`input-budget-${this.config.quote}`),
      spread: () => form.getByTestId('spread-input'),
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
  selectType(strategyType: StrategyType) {
    return this.page.getByTestId(strategyType).click();
  }
  selectSetting(strategySettings: StrategySettings) {
    return this.page.getByTestId(strategySettings).click();
  }
  async fillLimit(mode: Mode) {
    const { min, budget } = this.config[mode];
    const form = this.getLimitForm(mode);
    await form.limit().fill(min);
    await form.budget().fill(budget);
    return form;
  }
  async fillSymmetric() {
    const config = this.config as SymmetricStrategyConfig;
    const form = this.getSymmetricForm();
    await form.min().fill(config.buy.min);
    await form.max().fill(config.sell.max);
    await form.budgetBase().fill(config.sell.budget);
    await form.spread().fill(config.spread);
    return form;
  }
  nextStep() {
    return this.page.getByText('Next Step').click();
  }
  submit() {
    return this.page.getByText('Create Strategy').click();
  }
}
