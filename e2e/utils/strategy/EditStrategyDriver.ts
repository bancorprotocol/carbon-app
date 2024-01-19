import { Page } from 'playwright-core';
import { MainMenuDriver } from '../MainMenuDriver';
import { screenshot, shouldTakeScreenshot } from '../operators';
import { CreateStrategyTestCase, Setting, Direction, MinMax } from './types';
import {
  assertDisposableTestCase,
  assertRecurringTestCase,
  getRecurringSettings,
  screenshotPath,
} from './utils';

export class EditStrategyDriver {
  constructor(private page: Page, private testCase: CreateStrategyTestCase) {}

  submitBtn() {
    return this.page.getByTestId('edit-submit');
  }

  async waitForPage(type: 'deposit' | 'withdraw' | 'renew' | 'editPrices') {
    const options = { timeout: 10_000 };
    return this.page.waitForURL(`/strategies/edit/*?type=${type}`, options);
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

  async submit(type: 'deposit' | 'withdraw' | 'renew' | 'editPrices') {
    await this.submitBtn().isEnabled();
    if (shouldTakeScreenshot) {
      const mainMenu = new MainMenuDriver(this.page);
      await mainMenu.hide();
      const form = this.page.getByTestId('edit-form');
      const path = screenshotPath(this.testCase, type, 'form');
      await screenshot(form, path);
      await mainMenu.show();
    }
    return this.submitBtn().click();
  }

  async fillBudget(direction: Direction, budget: string) {
    const form = this.getBudgetSection(direction);
    return form.budget().fill(budget);
  }

  async fillPrice(direction: Direction, setting: Setting, order: MinMax) {
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

  async fillDisposablePrice() {
    assertDisposableTestCase(this.testCase);
    const { direction, setting, input } = this.testCase;
    return this.fillPrice(direction, setting, input.editPrice);
  }

  async fillDisposableBudget(type: 'deposit' | 'withdraw') {
    assertDisposableTestCase(this.testCase);
    const { direction, input } = this.testCase;
    return this.fillBudget(direction, input[type]);
  }
}
