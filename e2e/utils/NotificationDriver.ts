import { Page } from '@playwright/test';

type NotificationType =
  | 'reject'
  | 'approve'
  | 'revoke'
  | 'approve-error'
  | 'create-strategy'
  | 'renew-strategy'
  | 'edit-strategy-name'
  | 'withdraw-strategy'
  | 'delete-strategy'
  | 'change-rates-strategy'
  | 'trade'
  | 'pause-strategy'
  | 'deposit-strategy';

export class NotificationDriver {
  private notif = this.page.getByTestId(`notification-${this.type}`);
  constructor(private page: Page, private type: NotificationType) {}

  getTitle() {
    return this.notif.getByTestId('notif-title');
  }
  getDescription() {
    return this.notif.getByTestId('notif-description');
  }
  async close() {
    const isVisible = await this.notif.isVisible();
    if (isVisible) {
      this.notif.getByTestId('notif-close').click();
      return this.notif.waitFor({ state: 'detached' });
    }
  }
}
