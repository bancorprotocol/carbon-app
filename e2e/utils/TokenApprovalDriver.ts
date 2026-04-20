import { Page, expect } from '@playwright/test';
import { waitModalOpen } from './modal';
import { waitFor } from './operators';

interface Approval {
  symbol: string;
  amount: string;
}

export class TokenApprovalDriver {
  private approvedTokens = ['ETH'];
  constructor(private page: Page) {}
  async checkApproval(approvals: Approval[], limitedApproval?: boolean) {
    const noApprovalNeeded = approvals.every(({ symbol, amount }) => {
      if (!Number(amount)) return true;
      return this.approvedTokens.includes(symbol);
    });
    if (noApprovalNeeded) return;
    const modal = await waitModalOpen(this.page);
    for (const { symbol, amount } of approvals) {
      if (this.approvedTokens.includes(symbol)) {
        if (!Number(amount)) continue;
        const msg = modal.getByTestId(`msg-${symbol}`);
        await expect(msg).toHaveText('Pre-Approved');
      } else {
        if (limitedApproval) {
          await modal.getByTestId(`approve-limited-${symbol}`).click();
        }
        await modal.getByTestId(`approve-${symbol}`).click();
        const msg = await waitFor(this.page, `msg-${symbol}`, 20000);
        await expect(msg).toHaveText('Approved');
      }
    }
    const tokens = approvals.map((a) => a.symbol);
    if (!limitedApproval) this.approvedTokens.push(...tokens);
    await modal.getByTestId('approve-submit').click();
  }
}
