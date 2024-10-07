import { expect } from '@playwright/test';
import { Page } from 'playwright-core';
import { MainMenuDriver } from '../MainMenuDriver';
import { screenshot, shouldTakeScreenshot, waitFor } from '../operators';
import { CreateStrategyTestCase, StrategyType } from './types';
import { Setting, Direction, MinMax } from '../types';
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

  async waitForPage(strategyType: StrategyType, editType: EditType) {
    const options = { timeout: 10_000 };
    const mode = ['deposit', 'withdraw'].includes(editType)
      ? 'budget'
      : 'prices';
    const url = `/strategies/edit/*/${mode}/${strategyType}?*`;
    return this.page.waitForURL(url, options);
  }

  waitForWallet() {
    const loading = this.page.getByTestId('wallet-loading');
    return loading.waitFor({ state: 'detached' });
  }

  async waitForLoading() {
    const loadings = await this.page.locator('.loading-message').all();
    return Promise.all(
      loadings.map((loading) => loading.waitFor({ state: 'detached' }))
    );
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

  getOverlappingForm() {
    const form = this.page.getByTestId('edit-form');
    return {
      locator: form,
      min: () => form.getByTestId('input-min'),
      max: () => form.getByTestId('input-max'),
      spread: () => form.getByTestId('spread-input'),
      anchorRequired: () => form.getByTestId('require-anchor'),
      anchor: (anchor: 'buy' | 'sell') =>
        form.getByTestId(`anchor-${anchor}-label`),
      budgetSummary: () => form.getByTestId(`budget-summary`),
      action: (action: 'deposit' | 'withdraw') =>
        form.getByTestId(`action-${action}`),
      budget: () => form.getByTestId('input-budget'),
    };
  }

  async submit(type: 'deposit' | 'withdraw' | 'renew' | 'editPrices') {
    const btn = this.page.getByTestId('edit-submit');

    if (shouldTakeScreenshot) {
      const mainMenu = new MainMenuDriver(this.page);
      await mainMenu.hide();
      await waitTooltipsClose(this.page);
      const form = this.page.getByTestId('edit-form');
      const path = screenshotPath(this.testCase, type, 'form');
      await screenshot(form, path);
      await mainMenu.show();
    }

    try {
      await this.waitForLoading();
      await waitFor(this.page, 'approve-warnings', 2_000);
      if (await this.page.isVisible('[data-testid=approve-warnings]')) {
        await this.page.getByTestId('approve-warnings').click();
      }
      await btn.click();
    } catch {
      await btn.click();
    }
  }

  async fillBudget(direction: Direction, budget: string) {
    const form = this.getBudgetSection(direction);
    await form.budget().focus();
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
        await expect(form.price()).toHaveValue(/\S+/);
      }
      await form.price().focus();
      await form.price().fill(order.min);
    } else {
      if (type !== 'renew') {
        // wait for input to have a value before overriding
        await expect(form.min()).toHaveValue(/\S+/);
        await expect(form.max()).toHaveValue(/\S+/);
      }
      await form.min().focus();
      await form.min().fill(order.min);
      await form.max().focus();
      await form.max().fill(order.max);
    }
    return form;
  }

  async fillRecurringPrice(type: EditType) {
    assertRecurringTestCase(this.testCase);
    const { buy, sell } = this.testCase.input.editPrices;
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
    return this.fillPrice(direction, setting, input.editPrices, type);
  }

  async fillDisposableBudget(type: 'deposit' | 'withdraw') {
    assertDisposableTestCase(this.testCase);
    const { direction, input } = this.testCase;
    return this.fillBudget(direction, input[type]);
  }
}
