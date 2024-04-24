import { Page } from '@playwright/test';

export class MainMenuDriver {
  constructor(private page: Page) {}
  hide() {
    return this.page.getByTestId('main-menu').evaluate((el) => {
      el.style.visibility = 'hidden';
    });
  }
  show() {
    return this.page.getByTestId('main-menu').evaluate((el) => {
      el.style.visibility = 'unset';
    });
  }
  hideUserWallet() {
    return this.page.getByTestId('user-wallet').evaluate((el) => {
      el.style.fontFamily = 'monospace';
      el.style.visibility = 'hidden';
    });
  }
  showUserWallet() {
    return this.page.getByTestId('user-wallet').evaluate((el) => {
      el.style.fontFamily = 'unset';
      el.style.visibility = 'unset';
    });
  }
}
