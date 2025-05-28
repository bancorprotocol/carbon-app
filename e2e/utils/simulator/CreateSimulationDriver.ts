import { expect, Page } from '@playwright/test';
import {
  assertDebugToken,
  assertOverlappingTestCase,
  assertRecurringTestCase,
  getRecurringSettings,
  screenshotPath,
} from './utils';
import { CreateStrategyTestCase, StrategyType } from './types';
import { RangeOrder, debugTokens, Direction, Setting } from '../types';
import { waitModalClose, waitModalOpen } from '../modal';
import { screenshot, waitFor } from '../operators';
import { dayjs } from '../../../src/libs/dayjs';

const displayRange = (start?: Date, end?: Date) => {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
};

export class CreateSimulationDriver {
  constructor(private page: Page, private testCase: CreateStrategyTestCase) {}

  async waitForPriceChart(timeout?: number) {
    const btn = this.page.getByTestId('start-simulation-btn');
    await expect(btn).toHaveText('Start Simulation');
    return waitFor(this.page, 'price-chart', timeout);
  }

  async screenshotPriceChart() {
    const priceChart = this.page.getByTestId('price-chart');
    await priceChart.scrollIntoViewIfNeeded();
    await screenshot(
      priceChart,
      screenshotPath(this.testCase, 'simulator-input-price')
    );
  }

  waitForDisclaimerModal(timeout?: number) {
    return waitFor(this.page, 'sim-disclaimer-modal', timeout);
  }

  getForm() {
    return this.page.getByTestId('create-simulation-form');
  }

  getFormSection(direction: Direction) {
    const form = this.page.getByTestId(`${direction}-section`);
    return {
      locator: form,
      price: () => form.getByTestId('input-price'),
      min: () => form.getByTestId('input-min'),
      max: () => form.getByTestId('input-max'),
      budget: () => form.getByTestId('input-budget'),
      setting: (setting: 'limit' | 'range') => {
        return form.getByTestId(`tab-${setting}`);
      },
    };
  }

  async selectMonthYear(monthYear: string) {
    const findMonthYear = async () => {
      const selector = `text='${monthYear}'`;
      const isMonthYearVisible = await this.page.isVisible(selector);
      if (isMonthYearVisible) return;
      await this.page.getByTestId('date-picker-left-arrow').click();
      return findMonthYear();
    };
    return findMonthYear();
  }

  async selectDay(day: string, monthYear: string) {
    const dayButton = this.page
      .getByLabel(monthYear)
      .getByText(day, { exact: true });
    const dayButtonCount = await dayButton.count();
    // If the month has more than one day with the same number, find right one to press
    if (dayButtonCount > 1) {
      const index = Number(day) < 15 ? 0 : 1;
      await dayButton.nth(index).click();
    } else {
      await dayButton.click();
    }
  }

  parseTimestamp(timestamp: number) {
    return {
      day: dayjs(timestamp * 1000).format('D'),
      monthYear: dayjs(timestamp * 1000).format('MMMM YYYY'),
    };
  }

  async selectDate(timestamp: number) {
    const { day, monthYear } = this.parseTimestamp(timestamp);
    await this.selectMonthYear(monthYear);
    await this.selectDay(day, monthYear);
  }

  async fillDates(start: string, end: string) {
    const [from, to] = [dayjs(start).unix(), dayjs(end).unix()].sort();
    await this.page.getByTestId('date-picker-button').click();
    // Select date twice to force range to be 1 day long
    await this.selectDate(to);
    await this.selectDate(to);
    await this.selectDate(from);
    await this.page.getByTestId('date-picker-confirm').click();
    const dates = this.page.getByTestId('simulation-dates');
    const expectedDates = displayRange(new Date(start), new Date(end));
    await expect(dates).toHaveText(expectedDates);
  }

  clearSimulatorDisclaimer() {
    return this.page.getByTestId('clear-sim-disclaimer').click();
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

  selectStrategyType(strategyType: StrategyType) {
    return this.page.getByTestId(`select-type-${strategyType}`).click();
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

  async fillRecurring() {
    assertRecurringTestCase(this.testCase);
    const { buy, sell } = this.testCase.input;
    const [buySetting, sellSetting] = getRecurringSettings(this.testCase);
    const sellForm = await this.fillFormSection('sell', sellSetting, sell);
    const buyForm = await this.fillFormSection('buy', buySetting, buy);
    return { buyForm, sellForm };
  }

  async fillOverlapping() {
    assertOverlappingTestCase(this.testCase);
    const { buy, sell, spread } = this.testCase.input;
    const form = this.getOverlappingForm();
    await form.max().focus();
    await form.max().fill(sell.max.toString());
    await form.min().focus();
    await form.min().fill(buy.min.toString());
    await form.spread().fill(spread.toString());
    await form.budgetBase().focus();
    await form.budgetBase().fill(sell.budget.toString());
    return form;
  }

  async submit() {
    const btn = this.page.getByTestId('start-simulation-btn');
    await expect(btn).toHaveText('Start Simulation');
    await expect(btn).toBeEnabled();
    return btn.click();
  }
}
