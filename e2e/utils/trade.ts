import { Page, expect } from '@playwright/test';
import { navigateTo, waitFor } from './operators';
import { closeModal, waitModalClose, waitModalOpen } from './modal';

interface TradeConfig {
  mode: 'buy' | 'sell';
  source: string;
  target: string;
  sourceValue: string;
  targetValue: string;
}

export const testTrade = async (page: Page, config: TradeConfig) => {
  const { mode, source, target, sourceValue, targetValue } = config;
  await waitFor(page, `balance-${source}`, 20_000);
  await navigateTo(page, '/trade?*');

  // Select pair
  await page.getByTestId('select-trade-pair').click();
  await waitModalOpen(page);
  const pair = mode === 'buy' ? [target, source] : [source, target];
  page.getByTestId('search-token-pair').fill(`${pair.join(' ')}`);
  // TODO: expect "all" is checked
  const select = await waitFor(page, `select-${pair.join('_')}`);
  await select.click();
  await waitModalClose(page);

  // Enter pay
  const form = page.getByTestId(`${mode}-form`);
  await form.getByLabel('You Pay').fill(sourceValue);
  await expect(form.getByLabel('You Receive')).toHaveValue(targetValue);

  // Verify routing
  await form.getByTestId('routing').click();
  const modal = await waitFor(page, 'modal-container');
  await expect(modal.getByTestId('confirm-source')).toHaveValue(sourceValue);
  await expect(modal.getByTestId('confirm-target')).toHaveValue(targetValue);
  await closeModal(page);

  const submit = form.getByTestId('submit');
  await submit.click();

  // Token approval
  const approvalModal = await waitModalOpen(page);
  await approvalModal.getByTestId(`approve-${source}`).click();
  const approvalMsg = await waitFor(page, `msg-${source}`);
  await expect(approvalMsg).toHaveText('Approved');
  await approvalModal.getByText('Confirm Trade').click();
  await waitModalClose(page);

  // Verify notification
  const notif = page.getByTestId('notification-trade');
  await expect(notif.getByTestId('notif-title')).toHaveText('Success');
  await expect(notif.getByTestId('notif-description')).toHaveText(
    `Trading ${sourceValue} ${source} for ${target} was successfully completed.`
  );

  // Verify form empty
  expect(form.getByLabel('You Pay')).toHaveValue('');
  expect(form.getByLabel('You Receive')).toHaveValue('');
};
