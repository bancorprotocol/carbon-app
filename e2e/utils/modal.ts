import { Page, expect } from '@playwright/test';
import { waitFor } from './operators';

export const waitModalOpen = (page: Page) => waitFor(page, 'modal-container');
export const waitModalClose = (page: Page) => {
  return page.getByTestId('modal-container').waitFor({ state: 'detached' });
};
export const closeModal = async (page: Page) => {
  await page.getByTestId('modal-close').click();
  return waitModalClose(page);
};

export const checkApproval = async (page: Page, tokens: string[]) => {
  if (tokens.length === 1 && tokens[0] === 'ETH') return;
  const modal = await waitModalOpen(page);
  for (const token of tokens) {
    if (token === 'ETH') {
      const msg = modal.getByTestId(`msg-${token}`);
      await expect(msg).toHaveText('Pre-Approved');
    } else {
      await modal.getByTestId(`approve-${token}`).click();
      const msg = await waitFor(page, `msg-${token}`, 20000);
      await expect(msg).toHaveText('Approved');
    }
  }
  await modal.getByTestId('approve-submit').click();
  return modal.waitFor({ state: 'detached' });
};
