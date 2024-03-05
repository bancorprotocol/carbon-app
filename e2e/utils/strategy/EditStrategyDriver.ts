import { expect } from '@playwright/test';
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
import { waitTooltipsClose } from '../modal';

type EditType = 'deposit' | 'withdraw' | 'renew' | 'editPrices';

export class EditStrategyDriver {
  constructor(private page: Page, private testCase: CreateStrategyTestCase) {}

  async waitForPage(type: EditType) {
    const options = { timeout: 10_000 };
    return this.page.waitForURL(`/strategies/edit/*?type=${type}`, options);
  }

  waitForWallet() {
    const loading = this.page.getByTestId('wallet-loading');
    return loading.waitFor({ state: 'detached' });
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
    const btn = this.page.getByTestId('edit-submit');
    await expect(btn).toBeEnabled();
    if (shouldTakeScreenshot) {
      const mainMenu = new MainMenuDriver(this.page);
      await mainMenu.hide();
      await btn.hover(); // Enforce hover to have always the same color
      await waitTooltipsClose(this.page);
      const form = this.page.getByTestId('edit-form');
      const path = screenshotPath(this.testCase, type, 'form');
      await screenshot(form, path);
      await mainMenu.show();
    }
    return btn.click();
  }

  async fillBudget(direction: Direction, budget: string) {
    const form = this.getBudgetSection(direction);
    return form.budget().fill(budget);
  }

  async fillPrice(
    direction: Direction,
    setting: Setting,
    order: MinMax,
    type: EditType
  ) {
    const form = this.getPriceSection(direction);
    await form.setting(setting).click();
    if (setting === 'limit') {
      if (type !== 'renew') {
        // wait for input to have a value before overriding
        expect(form.price()).toHaveValue(/\S+/);
      }
      await form.price().fill(order.min);
    } else {
      if (type !== 'renew') {
        // wait for input to have a value before overriding
        expect(form.min()).toHaveValue(/\S+/);
        expect(form.max()).toHaveValue(/\S+/);
      }
      await form.min().fill(order.min);
      await form.max().fill(order.max);
    }
    return form;
  }

  async fillRecurringPrice(type: EditType) {
    assertRecurringTestCase(this.testCase);
    const { buy, sell } = this.testCase.input.editPrice;
    const [buySetting, sellSetting] = getRecurringSettings(this.testCase);
    const sellForm = await this.fillPrice('sell', sellSetting, sell, type);
    const buyForm = await this.fillPrice('buy', buySetting, buy, type);
    return { buyForm, sellForm };
  }

  async fillRecurringBudget(type: 'deposit' | 'withdraw') {
    assertRecurringTestCase(this.testCase);
    const { buy, sell } = this.testCase.input[type];
    const sellForm = await this.fillBudget('sell', sell);
    const buyForm = await this.fillBudget('buy', buy);
    return { buyForm, sellForm };
  }

  async fillDisposablePrice(type: EditType) {
    assertDisposableTestCase(this.testCase);
    const { direction, setting, input } = this.testCase;
    return this.fillPrice(direction, setting, input.editPrice, type);
  }

  async fillDisposableBudget(type: 'deposit' | 'withdraw') {
    assertDisposableTestCase(this.testCase);
    const { direction, input } = this.testCase;
    return this.fillBudget(direction, input[type]);
  }
}
