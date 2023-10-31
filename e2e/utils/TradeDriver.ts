/* eslint-disable prettier/prettier */
import { Page } from '@playwright/test';
import { waitFor } from './operators';
import { closeModal, waitModalClose, waitModalOpen } from './modal';

interface TradeConfig {
  mode: 'buy' | 'sell';
  source: string;
  target: string;
  sourceValue: string;
  targetValue: string;
}

export class TradeDriver {
  public form = this.page.getByTestId(`${this.config.mode}-form`);

  constructor(private page: Page, private config: TradeConfig) {}

  getPayInput() {
    return this.form.getByLabel('You Pay');
  }

  getReceiveInput() {
    return this.form.getByLabel('You Receive');
  }

  async selectPair() {
    const { mode, target, source } = this.config;
    await this.page.getByTestId('select-trade-pair').click();
    await waitModalOpen(this.page);
    const pair = mode === 'buy' ? [target, source] : [source, target];
    this.page.getByTestId('search-token-pair').fill(`${pair.join(' ')}`);
    const select = await waitFor(this.page, `select-${pair.join('_')}`);
    await select.click();
    await waitModalClose(this.page);
  }

  setPay() {
    const { sourceValue } = this.config;
    return this.form.getByLabel('You Pay').fill(sourceValue);
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
