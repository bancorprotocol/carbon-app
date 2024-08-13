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

// Keep track of approved token for the current test case.
const approvedTokens: string[] = ['ETH'];
export const checkApproval = async (page: Page, tokens: string[]) => {
  if (tokens.every((token) => approvedTokens.includes(token))) return;
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
  approvedTokens.push(...tokens);
  await modal.getByTestId('approve-submit').click();
  return modal.waitFor({ state: 'detached' });
};

export const waitTooltipsClose = async (page: Page) => {
  const selector = '[data-testid="tippy-tooltip"]';
  await page.mouse.move(0, 0);
  const tooltips = await page.locator(selector).all();
  for (const tooltip of tooltips) {
    await tooltip.waitFor({ state: 'detached' });
  }
};
