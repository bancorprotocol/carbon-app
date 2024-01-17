import { Page } from '@playwright/test';
import {
  CreateStrategyInput,
  assertDebugToken,
  debugTokens,
} from './../../utils/strategy/template';
import { waitModalClose, waitModalOpen } from '../modal';
import { TestCase } from '../types';

type Setting = 'limit' | 'range';
type Direction = 'buy' | 'sell';
type StrategySettings =
  | `two-${Setting}s`
  | `${Direction}-${Setting}`
  | 'overlapping';

export interface RecurringStrategyInput extends CreateStrategyInput {
  type: 'recurring';
  setting: `${Setting}_${Setting}`;
}
export interface RecurringStrategyOutput {
  create: {
    totalFiat: string;
    buy: {
      min: string;
      max: string;
      budget: string;
      fiat: string;
    };
    sell: {
      min: string;
      max: string;
      budget: string;
      fiat: string;
    };
  };
}
export type RecurringStrategyTestCase = TestCase<
  RecurringStrategyInput,
  RecurringStrategyOutput
>;

export interface OverlappingStrategyInput extends CreateStrategyInput {
  type: 'overlapping';
  spread: string;
}
export interface OverlappingStrategyOutput {
  create: {
    totalFiat: string;
    buy: {
      min: string;
      max: string;
      budget: string;
      fiat: string;
    };
    sell: {
      min: string;
      max: string;
      budget: string;
      fiat: string;
    };
  };
}
export type OverlappingStrategyTestCase = TestCase<
  OverlappingStrategyInput,
  OverlappingStrategyOutput
>;

export interface DisposableStrategyInput extends CreateStrategyInput {
  type: 'disposable';
  setting: Setting;
  direction: Direction;
}
export interface DisposableStrategyOutput {}
export type DisposableStrategyTestCase = TestCase<
  DisposableStrategyInput,
  DisposableStrategyOutput
>;

export type CreateStrategyTestCase =
  | DisposableStrategyTestCase
  | RecurringStrategyTestCase
  | OverlappingStrategyTestCase;

export function assertDisposableTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is DisposableStrategyTestCase {
  if (testCase.input.type !== 'disposable') {
    throw new Error('Test case should be disposable');
  }
}

export function assertRecurringTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is RecurringStrategyTestCase {
  if (testCase.input.type !== 'recurring') {
    throw new Error('Test case should be recurring');
  }
}

export function assertOverlappingTestCase(
  testCase: CreateStrategyTestCase
): asserts testCase is OverlappingStrategyTestCase {
  if (testCase.input.type !== 'overlapping') {
    throw new Error('Test case should be overlapping');
  }
}

export class CreateStrategyDriver {
  constructor(private page: Page, private testCase: CreateStrategyInput) {}

  getRecurringLimitForm(direction: Direction) {
    const form = this.page.getByTestId(`${direction}-section`);
    return {
      price: () => form.getByTestId(`input-limit-${direction}`),
      budget: () => form.getByTestId('input-budget'),
      outcomeValue: () => form.getByTestId('outcome-value'),
      outcomeQuote: () => form.getByTestId('outcome-quote'),
      setting: (setting: 'limit' | 'range') => {
        return form.getByTestId(`tab-${setting}`);
      },
    };
  }

  getOverlappingForm() {
    const form = this.page.getByTestId('create-strategy-form');
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
  async fillRecurringLimit(direction: Direction) {
    const { min, budget } = this.testCase[direction];
    const form = this.getRecurringLimitForm(direction);
    await form.setting('limit').click();
    await form.price().fill(min.toString());
    await form.budget().fill(budget.toString());
    return form;
  }
  async fillOverlapping() {
    const testCase = this.testCase as OverlappingStrategyInput;
    const form = this.getOverlappingForm();
    await form.max().fill(testCase.sell.max.toString());
    await form.min().fill(testCase.buy.min.toString());
    await form.spread().fill(testCase.spread.toString());
    await form.budgetBase().fill(testCase.sell.budget.toString());
    return form;
  }
  nextStep() {
    return this.page.getByText('Next Step').click();
  }
  submit() {
    return this.page.getByText('Create Strategy').click();
  }
}
