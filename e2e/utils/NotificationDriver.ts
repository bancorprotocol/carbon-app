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

  private async closeNotif(locator: Locator) {
    const btn = locator.getByTestId('notif-close');
    const isVisible = await btn.isVisible();
    if (isVisible) {
      await btn.click();
      return locator.waitFor({ state: 'detached' });
    }
  }
  async closeAll() {
    const all = await this.getAllNotifications().all();
    const closeAll = all.map((locator) => this.closeNotif(locator));
    return Promise.all(closeAll);
  }
}
