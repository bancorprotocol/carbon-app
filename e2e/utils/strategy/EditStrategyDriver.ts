import { expect } from '@playwright/test';
import { Page } from 'playwright-core';
import { MainMenuDriver } from '../MainMenuDriver';
import { screenshot, shouldTakeScreenshot, waitFor } from '../operators';
import { CreateStrategyTestCase } from './types';
import { Setting, Direction, MinMax } from '../types';
import {
  assertDisposableTestCase,
  assertOverlappingTestCase,
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

  getOverlappingForm() {
    const form = this.page.getByTestId('edit-form');
    return {
      locator: form,
      min: () => form.getByTestId('input-min'),
      max: () => form.getByTestId('input-max'),
      spread: () => form.getByTestId('spread-input'),
      anchorRequired: () => form.getByTestId('require-anchor'),
      anchor: (anchor: 'buy' | 'sell') => form.getByTestId(`anchor-${anchor}`),
      budgetSummary: () => form.getByTestId(`budget-summary`),
      action: (action: 'deposit' | 'withdraw') =>
        form.getByTestId(`action-${action}`),
      budget: () => form.getByTestId('input-budget'),
    };
  }

  async submit(type: 'deposit' | 'withdraw' | 'renew' | 'editPrices') {
    const btn = this.page.getByTestId('edit-submit');

    const approveWarningsAndWait = async () => {
      waitFor(this.page, 'approve-warnings');
      if (await this.page.isVisible('[data-testid=approve-warnings]')) {
        this.page.getByTestId('approve-warnings').click();
      }
      await expect(btn).toBeEnabled();
    };

    // If the submit button is not enabled, try to approve warnings and retry
    await expect(btn)
      .toBeEnabled()
      .catch(() => approveWarningsAndWait());

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

  async fillOverlapping(type: EditType) {
    assertOverlappingTestCase(this.testCase);
    const input = this.testCase.input[type];
    const form = this.getOverlappingForm();
    if (input.min) await form.min().fill(input.min);
    if (input.max) await form.max().fill(input.max);
    if (input.spread) await form.spread().fill(input.spread);
    await expect(form.anchorRequired()).toBeVisible();
    await form.anchor(input.anchor).click();
    if (input.budget) {
      await form.budgetSummary().click();
      if (input.action) await form.action(input.action).click();
      await form.budget().fill(input.budget);
    }
  }
}
