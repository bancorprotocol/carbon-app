import { Page } from '@playwright/test';
import { waitFor } from './operators';

export const waitModalOpen = (page: Page) => waitFor(page, 'modal-container');
export const waitModalClose = (page: Page) => {
  return page.getByTestId('modal-container').waitFor({ state: 'detached' });
};
export const closeModal = async (page: Page) => {
  await page.getByTestId('modal-close').click();
  return waitModalClose(page);
};
