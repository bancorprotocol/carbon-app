import { DebugDriver } from './../../utils/DebugDriver';
import { navigateTo } from './../../utils/operators';
import { MyStrategyDriver } from './../../utils/strategy/MyStrategyDriver';
import { Page } from 'playwright-core';
import { CreateStrategyInput, RangeOrder, Setting } from './types';
import { Direction } from 'readline';

export class ManageStrategyDriver {
  constructor(private page: Page) {}

  async createStrategy(input: CreateStrategyInput) {
    const debug = new DebugDriver(this.page);
    await debug.createStrategy(input);
    await navigateTo(this.page, '/');
    const myStrategies = new MyStrategyDriver(this.page);
    return await myStrategies.getStrategy(1);
  }

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
    order: RangeOrder
  ) {
    const form = this.getFormSection(direction);
    await form.setting(setting).click();
    if (setting === 'limit') {
      await form.price().fill(order.min);
    } else {
      await form.min().fill(order.min);
      await form.max().fill(order.max);
    }
    await form.budget().fill(order.budget);
    return form;
  }
}
