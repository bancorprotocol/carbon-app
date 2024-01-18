import { Page } from 'playwright-core';
import { CreateStrategyTestCase, Setting, Direction } from './types';
import { assertRecurringTestCase, getRecurringSettings } from './utils';

export class EditStrategyDriver {
  constructor(private page: Page, private testCase: CreateStrategyTestCase) {}

  submitBtn() {
    return this.page.getByTestId('edit-submit');
  }

  async waitForEditPage(type: 'deposit' | 'withdraw' | 'renew' | 'editPrices') {
    await this.page.waitForURL(`/strategies/edit/*?type=${type}`, {
      timeout: 10_000,
    });
  }

  getPriceSection(direction: Direction) {
    const form = this.page.getByTestId(`${direction}-section`);
    return {
      locator: form,
      price: () => form.getByTestId('input-price'),
      min: () => form.getByTestId('input-min'),
      max: () => form.getByTestId('input-max'),
      outcomeValue: () => form.getByTestId('outcome-value'),
      outcomeQuote: () => form.getByTestId('outcome-quote'),
      setting: (setting: 'limit' | 'range') => {
        return form.getByTestId(`tab-${setting}`);
      },
    };
  }

  getBudgetSection(direction: Direction) {
    const form = this.page.getByTestId(`${direction}-section`);
    return {
      locator: form,
      budget: () => form.getByTestId('input-budget'),
    };
  }

  async submit() {
    await this.submitBtn().isEnabled();
    return this.submitBtn().click();
  }

  async fillBudget(direction: Direction, budget: string) {
    const form = this.getBudgetSection(direction);
    return form.budget().fill(budget);
  }

  async fillPrice(
    direction: Direction,
    setting: Setting,
    order: { min: string; max: string }
  ) {
    const form = this.getPriceSection(direction);
    await form.setting(setting).click();
    if (setting === 'limit') {
      await form.price().fill(order.min);
    } else {
      await form.min().fill(order.min);
      await form.max().fill(order.max);
    }
    return form;
  }

  async fillRecurringPrice() {
    assertRecurringTestCase(this.testCase);
    const { buy, sell } = this.testCase.input.editPrice;
    const [buySetting, sellSetting] = getRecurringSettings(this.testCase);
    const buyForm = await this.fillPrice('buy', buySetting, buy);
    const sellForm = await this.fillPrice('sell', sellSetting, sell);
    return { buyForm, sellForm };
  }

  async fillRecurringBudget(type: 'deposit' | 'withdraw') {
    assertRecurringTestCase(this.testCase);
    const { buy, sell } = this.testCase.input[type];
    const buyForm = await this.fillBudget('buy', buy);
    const sellForm = await this.fillBudget('sell', sell);
    return { buyForm, sellForm };
  }

  // async fillDisposablePrice() {
  //   assertDisposableTestCase(this.testCase);
  //   const { buy, sell } = this.testCase.input.editPrice;
  //   const [buySetting, sellSetting] = getRecurringSettings(this.testCase);
  //   const buyForm = await this.fillPrice('buy', buySetting, buy);
  //   return { buyForm, sellForm };
  // }

  // async fillDisposableBudget(type: 'deposit' | 'withdraw') {
  //   assertRecurringTestCase(this.testCase);
  //   const { buy, sell } = this.testCase.input[type];
  //   const buyForm = await this.fillBudget('buy', buy);
  //   const sellForm = await this.fillBudget('sell', sell);
  //   return { buyForm, sellForm };
  // }
}
