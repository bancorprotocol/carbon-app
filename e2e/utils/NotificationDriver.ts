import { Locator, Page } from '@playwright/test';

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
  constructor(private page: Page) {}

  getAllNotifications() {
    return this.page.locator('[data-testid="notification-list"] > li');
  }

  getNotification(type: NotificationType) {
    const notif = this.page.getByTestId(`notification-${type}`);
    return {
      locator: notif,
      title: () => notif.getByTestId('notif-title'),
      description: () => notif.getByTestId('notif-description'),
      close: () => this.closeNotif(notif),
    };
  }

  private async closeNotif(notif: Locator) {
    await notif.waitFor({ state: 'attached' });
    const btn = notif.getByTestId('notif-close');
    const isVisible = await btn.isVisible();
    if (isVisible) {
      // Prevent playwright to check if the button is inside viewport
      await btn.dispatchEvent('click');
      return notif.waitFor({ state: 'detached' });
    }
  }
  async closeAll() {
    const all = await this.getAllNotifications().all();
    const closeAll = all.map((locator) => this.closeNotif(locator));
    return Promise.all(closeAll);
  }
}
