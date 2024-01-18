import { Page } from 'playwright-core';
import { CreateStrategyTestCase, Setting, Direction } from './types';
import { assertRecurringTestCase, getRecurringSettings } from './utils';

export class EditStrategyDriver {
  constructor(private page: Page, private testCase: CreateStrategyTestCase) {}
  async waitForEditPage(type: 'deposit' | 'withdraw' | 'renew' | 'editPrices') {
    await this.page.waitForURL(`/strategies/edit/*?type=${type}`, {
      timeout: 10_000,
    });
  }

  getFormSection(direction: Direction) {
    const form = this.page.getByTestId(`${direction}-section`);
    return {
      locator: form,
      price: () => form.getByTestId('input-price'),
      min: () => form.getByTestId('input-min'),
      max: () => form.getByTestId('input-max'),
      budget: () => form.getByTestId('input-budget'),
      outcomeValue: () => form.getByTestId('outcome-value'),
      outcomeQuote: () => form.getByTestId('outcome-quote'),
      setting: (setting: 'limit' | 'range') => {
        return form.getByTestId(`tab-${setting}`);
      },
    };
  }

  async fillBudget(
    type: 'deposit' | 'withdraw',
    order: 'buy' | 'sell',
    budget: string | number
  ) {
    await this.page
      .getByTestId(`budget-${type}-${order}-input`)
      .fill(budget.toString());
  }

  async fillFormSection(
    direction: Direction,
    setting: Setting,
    order: { min: string; max: string }
  ) {
    const form = this.getFormSection(direction);
    await form.setting(setting).click();
    if (setting === 'limit') {
      await form.price().fill(order.min);
    } else {
      await form.min().fill(order.min);
      await form.max().fill(order.max);
    }
    return form;
  }

  async fillRecurring() {
    assertRecurringTestCase(this.testCase);
    const { buy, sell } = this.testCase.input.editPrice;
    const [buySetting, sellSetting] = getRecurringSettings(this.testCase);
    const buyForm = await this.fillFormSection('buy', buySetting, buy);
    const sellForm = await this.fillFormSection('sell', sellSetting, sell);
    return { buyForm, sellForm };
  }
}
