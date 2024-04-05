import { expect, Page } from '@playwright/test';
import {
  assertDebugToken,
  assertDisposableTestCase,
  assertOverlappingTestCase,
  assertRecurringTestCase,
  getRecurringSettings,
  screenshotPath,
} from './utils';
import { CreateStrategyTestCase, StrategySettings } from './types';
import { RangeOrder, debugTokens, Direction, Setting } from '../types';
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
      min: () => form.getByLabel('Min Buy Price'),
      max: () => form.getByLabel('Max Sell Price'),
      budgetBase: () => form.getByTestId('input-budget-base'),
      budgetQuote: () => form.getByTestId('input-budget-quote'),
      spread: () => form.getByTestId('spread-input'),
    };
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

  selectSetting(strategySettings: StrategySettings) {
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
      await form.price().fill(order.min);
    } else {
      await form.min().fill(order.min);
      await form.max().fill(order.max);
    }
    await form.budget().fill(order.budget);
    return form;
  }

  async fillRecurring() {
    assertRecurringTestCase(this.testCase);
    const { buy, sell } = this.testCase.input.create;
    const [buySetting, sellSetting] = getRecurringSettings(this.testCase);
    const sellForm = await this.fillFormSection('sell', sellSetting, sell);
    const buyForm = await this.fillFormSection('buy', buySetting, buy);
    return { buyForm, sellForm };
  }

  async fillOverlapping() {
    assertOverlappingTestCase(this.testCase);
    const { buy, sell, spread } = this.testCase.input.create;
    const form = this.getOverlappingForm();
    await form.max().fill(sell.max.toString());
    await form.min().fill(buy.min.toString());
    await form.spread().fill(spread.toString());
    await form.budgetBase().fill(sell.budget.toString());
    return form;
  }

  async fillDisposable() {
    assertDisposableTestCase(this.testCase);
    const { direction, setting } = this.testCase;
    await this.page.getByTestId(`tab-${direction}`).click();
    const order = this.testCase.input.create;
    return this.fillFormSection(direction, setting, order);
  }

  nextStep() {
    return this.page.getByText('Next Step').click();
  }

  async submit() {
    const btn = this.page.getByText('Create Strategy');

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

    if (shouldTakeScreenshot) {
      const mainMenu = new MainMenuDriver(this.page);
      await mainMenu.hide();
      await btn.hover(); // Enforce hover to have always the same color
      await waitTooltipsClose(this.page);
      const form = this.getForm();
      const path = screenshotPath(this.testCase, 'create', 'form');
      await screenshot(form, path);
      await mainMenu.show();
    }
    return btn.click();
  }
}
