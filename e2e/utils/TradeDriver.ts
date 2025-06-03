import { Page } from '@playwright/test';
import { waitFor } from './operators';
import { closeModal, waitModalClose, waitModalOpen } from './modal';
import { debugTokens } from './types';
import { TestCaseSwap, TradeTestCase } from './trade/types';
import { assertDebugToken } from './strategy/utils';

export class TradeDriver {
  public form = this.page.getByTestId(`${this.testCase.mode}-form`);

  constructor(
    private page: Page,
    private testCase: TradeTestCase,
  ) {}

  getPayInput() {
    return this.form.getByLabel('You Pay');
  }

  getReceiveInput() {
    return this.form.getByLabel('You Receive');
  }

  setMode(mode: 'buy' | 'sell') {
    return this.page.getByTestId(`tab-${mode}`).click();
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

  setPay(swap: TestCaseSwap) {
    const { sourceValue } = swap;
    return this.form.getByLabel('You Pay').fill(sourceValue);
  }

  awaitSuccess() {
    return this.page
      .getByTestId('notification-trade')
      .getByLabel('Success')
      .waitFor({ state: 'visible', timeout: 10_000 });
  }

  async openRouting() {
    await this.form.getByTestId('routing').click();
    const modal = await waitFor(this.page, 'modal-container');
    return {
      getSource: () => modal.getByTestId('confirm-source'),
      getTarget: () => modal.getByTestId('confirm-target'),
      close: () => closeModal(this.page),
    };
  }

  submit() {
    return this.form.getByTestId('submit').click();
  }
}
