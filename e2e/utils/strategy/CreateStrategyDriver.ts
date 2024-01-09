import { Page } from '@playwright/test';
import { waitModalClose, waitModalOpen } from '../modal';

/** Min & max should be equal for limit strategy */
interface PriceField {
  min: number;
  max: number;
  budget: number;
  budgetFiat: number;
}

interface BaseConfig {
  base: string;
  quote: string;
  setting: 'limit' | 'range' | 'overlapping';
  buy: PriceField;
  sell: PriceField;
}

export interface LimiStrategyConfig extends BaseConfig {
  setting: 'limit';
}
export interface OverlappingStrategyConfig extends BaseConfig {
  setting: 'overlapping';
  spread: number;
}

export type CreateStrategyConfig =
  | LimiStrategyConfig
  | OverlappingStrategyConfig;

type Mode = 'buy' | 'sell';
type StrategySettings =
  | 'two-limits'
  | 'two-ranges'
  | 'overlapping'
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
      setting: (setting: 'limit' | 'range') => {
        return form.getByTestId(`tab-${setting}`);
      },
    };
  }

  getOverlappingForm() {
    const form = this.page.getByTestId('create-strategy-form');
    return {
      min: () => form.getByLabel('Min Buy Price'),
      max: () => form.getByLabel('Max Sell Price'),
      budgetBase: () => form.getByTestId('input-budget-base'),
      budgetQuote: () => form.getByTestId('input-budget-quote'),
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
  selectSetting(strategySettings: StrategySettings) {
    return this.page.getByTestId(strategySettings).click();
  }
  async fillLimit(mode: Mode) {
    const { min, budget } = this.config[mode];
    const form = this.getLimitForm(mode);
    await form.setting('limit').click();
    await form.limit().fill(min.toString());
    await form.budget().fill(budget.toString());
    return form;
  }
  async fillOverlapping() {
    const config = this.config as OverlappingStrategyConfig;
    const form = this.getOverlappingForm();
    await form.max().fill(config.sell.max.toString());
    await form.min().fill(config.buy.min.toString());
    await form.spread().fill(config.spread.toString());
    await form.budgetBase().fill(config.sell.budget.toString());
    return form;
  }
  nextStep() {
    return this.page.getByText('Next Step').click();
  }
  submit() {
    return this.page.getByText('Create Strategy').click();
  }
}
