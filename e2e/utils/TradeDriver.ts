/* eslint-disable prettier/prettier */
import { Page } from '@playwright/test';
import { waitFor } from './operators';
import { closeModal, waitModalClose, waitModalOpen } from './modal';
import { Direction, debugTokens } from './types';

interface TradeTestCase {
  mode: Direction;
  source: string;
  target: string;
  sourceValue: string;
  targetValue: string;
}

export class TradeDriver {
  public form = this.page.getByTestId(`${this.testCase.mode}-form`);

  constructor(private page: Page, private testCase: TradeTestCase) {}

  getPayInput() {
    return this.form.getByLabel('You Pay');
  }

  getReceiveInput() {
    return this.form.getByLabel('You Receive');
  }

  async selectPair() {
    const { mode, target, source } = this.testCase;

    await this.page.getByTestId('select-trade-pair').click();
    await waitModalOpen(this.page);
    const pair = mode === 'buy' ? [target, source] : [source, target];
    const pairKey = [debugTokens[pair[0]], debugTokens[pair[1]]].join('_');
    this.page.getByTestId('search-token-pair').fill(`${pair.join(' ')}`);
    const select = await waitFor(this.page, `select-${pairKey}`);
    await select.click();
    await waitModalClose(this.page);
  }

  setPay() {
    const { sourceValue } = this.testCase;
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
