import { Page } from '@playwright/test';
import {
  assertDebugToken,
  assertDisposableTestCase,
  assertRecurringTestCase,
  getRecurringSettings,
  screenshotPath,
} from './utils';
import { CreateStrategyTestCase, StrategyType } from './types';
import {
  RangeOrder,
  debugTokens,
  Direction,
  Setting,
  StrategyCase,
} from '../types';
import { waitModalClose, waitModalOpen, waitTooltipsClose } from '../modal';
import { screenshot, shouldTakeScreenshot, waitFor } from '../operators';
import { MainMenuDriver } from '../MainMenuDriver';

export class CreateStrategyDriver {
  constructor(private page: Page, private testCase: CreateStrategyTestCase) {}

  getForm() {
    return this.page.getByTestId('create-strategy-form');
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

  getOverlappingForm() {
    const form = this.getForm();
    return {
      locator: form,
      min: () => form.getByTestId('input-min'),
      max: () => form.getByTestId('input-max'),
      spread: () => form.getByTestId('spread-input'),
      anchorRequired: () => form.getByTestId('require-anchor'),
      anchor: (anchor: 'buy' | 'sell') =>
        form.getByTestId(`anchor-${anchor}-label`),
      budget: () => form.getByTestId('input-budget'),
    };
  }

  async waitForLoading() {
    const loadings = await this.page.locator('.loading-message').all();
    return Promise.all(
      loadings.map((loading) => loading.waitFor({ state: 'detached' }))
    );
  }

  async selectToken(tokenType: 'base' | 'quote') {
    const symbol = this.testCase[tokenType];
    assertDebugToken(symbol);
    const token = debugTokens[symbol];
    await this.page.getByTestId(`select-${tokenType}-token`).click();
    await waitModalOpen(this.page);
    await this.page.getByLabel('Select Token').fill(symbol);
    await this.page.getByTestId(`select-token-${token}`).click();
    await waitModalClose(this.page);
  }

  selectSetting(strategySettings: StrategyType) {
    return this.page.getByTestId(strategySettings).click();
  }

  async fillFormSection(
    direction: Direction,
    setting: Setting,
    order: RangeOrder
  ) {
    const form = this.getFormSection(direction);
    await form.setting(setting).click();
    if (setting === 'limit') {
      await form.price().focus();
      await form.price().fill(order.min);
    } else {
      await form.min().focus();
      await form.min().fill(order.min);
      await form.max().focus();
      await form.max().fill(order.max);
    }
    await form.budget().focus();
    await form.budget().fill(order.budget);
    return form;
  }

  async fillRecurring(direction: Direction) {
    assertRecurringTestCase(this.testCase);
    const input = this.testCase.input.create[direction];
    const index = direction === 'buy' ? 0 : 1;
    const settings = getRecurringSettings(this.testCase)[index];
    return this.fillFormSection(direction, settings, input);
  }

  async fillDisposable() {
    assertDisposableTestCase(this.testCase);
    const { direction, setting } = this.testCase;
    await this.page.getByTestId(`tab-${direction}`).click();
    const order = this.testCase.input.create;
    return this.fillFormSection(direction, setting, order);
  }

  async submit(type: StrategyCase) {
    const btn = this.page.getByTestId('create-strategy');
    if (shouldTakeScreenshot) {
      const mainMenu = new MainMenuDriver(this.page);
      await mainMenu.hide();
      await waitTooltipsClose(this.page);
      const form = this.getForm();
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
      await btn.click({ timeout: 5_000 });
    }
  }
}
