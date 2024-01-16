import { Page } from '@playwright/test';
import { CreateStrategyTemplate } from './../../utils/strategy/template';
import { waitModalClose, waitModalOpen } from '../modal';

export interface RecurringStrategyTestCase extends CreateStrategyTemplate {
  setting: 'limit_limit' | 'range_range' | 'limit_range' | 'range_limit';
}
export interface OverlappingStrategyTestCase extends CreateStrategyTemplate {
  type: 'overlapping';
  spread: string;
}

export type CreateStrategyTestCase =
  | RecurringStrategyTestCase
  | OverlappingStrategyTestCase;

type Mode = 'buy' | 'sell';
type StrategySettings =
  | 'two-limits'
  | 'two-ranges'
  | 'overlapping'
  | `${Mode}-range`
  | `${Mode}-limit`;

export class CreateStrategyDriver {
  constructor(private page: Page, private testCase: CreateStrategyTemplate) {}

  getRecurringLimitForm(mode: Mode) {
    const form = this.page.getByTestId(`${mode}-section`);
    return {
      price: () => form.getByTestId(`input-limit-${mode}`),
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
      locator: form,
      min: () => form.getByLabel('Min Buy Price'),
      max: () => form.getByLabel('Max Sell Price'),
      budgetBase: () => form.getByTestId('input-budget-base'),
      budgetQuote: () => form.getByTestId('input-budget-quote'),
      spread: () => form.getByTestId('spread-input'),
    };
  }

  async selectToken(tokenType: 'base' | 'quote') {
    const token = this.testCase[tokenType];
    await this.page.getByTestId(`select-${tokenType}-token`).click();
    await waitModalOpen(this.page);
    await this.page.getByLabel('Select Token').fill(token);
    await this.page.getByTestId(`select-token-${token}`).click();
    await waitModalClose(this.page);
  }
  selectSetting(strategySettings: StrategySettings) {
    return this.page.getByTestId(strategySettings).click();
  }
  async fillRecurringLimit(mode: Mode) {
    const { min, budget } = this.testCase[mode];
    const form = this.getRecurringLimitForm(mode);
    await form.setting('limit').click();
    await form.price().fill(min.toString());
    await form.budget().fill(budget.toString());
    return form;
  }
  async fillOverlapping() {
    const testCase = this.testCase as OverlappingStrategyTestCase;
    const form = this.getOverlappingForm();
    await form.max().fill(testCase.sell.max.toString());
    await form.min().fill(testCase.buy.min.toString());
    await form.spread().fill(testCase.spread.toString());
    await form.budgetBase().fill(testCase.sell.budget.toString());
    return form;
  }
  nextStep() {
    return this.page.getByText('Next Step').click();
  }
  submit() {
    return this.page.getByText('Create Strategy').click();
  }
}
