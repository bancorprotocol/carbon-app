import { Page, expect } from '@playwright/test';
import { waitModalOpen } from './modal';
import { waitFor } from './operators';

export class TokenApprovalDriver {
  private approvedTokens = ['ETH'];
  constructor(private page: Page) {}
  async checkApproval(tokens: string[]) {
    if (tokens.every((token) => this.approvedTokens.includes(token))) return;
    const modal = await waitModalOpen(this.page);
    for (const token of tokens) {
      if (token === 'ETH') {
        const msg = modal.getByTestId(`msg-${token}`);
        await expect(msg).toHaveText('Pre-Approved');
      } else {
        await modal.getByTestId(`approve-${token}`).click();
        const msg = await waitFor(this.page, `msg-${token}`, 20000);
        await expect(msg).toHaveText('Approved');
      }
    }
    this.approvedTokens.push(...tokens);
    await modal.getByTestId('approve-submit').click();
  }
}
