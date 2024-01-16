import { CreateStrategyTemplate } from './../../utils/strategy/template';
import { DebugDriver } from './../../utils/DebugDriver';
import { navigateTo } from './../../utils/operators';
import { MyStrategyDriver } from './../../utils/strategy/MyStrategyDriver';
import { Page } from 'playwright-core';

export class ManageStrategyDriver {
  constructor(private page: Page) {}

  async createStrategy(testCase: CreateStrategyTemplate) {
    const debug = new DebugDriver(this.page);
    await debug.createStrategy(testCase);
    await navigateTo(this.page, '/');
    const myStrategies = new MyStrategyDriver(this.page);
    return await myStrategies.getStrategy(1);
  }

  async waitForEditPage(type: 'deposit' | 'withdraw' | 'renew' | 'editPrices') {
    await this.page.waitForURL(`/strategies/edit/*?type=${type}`, {
      timeout: 10_000,
    });
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

  async fillLimitPrice(order: 'buy' | 'sell', price: number | string) {
    await this.page.getByTestId(`input-limit-${order}`).fill(price.toString());
  }
}
