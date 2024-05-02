import { Locator, Page } from '@playwright/test';

export class MainMenuDriver {
  constructor(private target: Page | Locator) {}
  hide() {
    return this.target.getByTestId('main-menu').evaluate((el) => {
      el.style.visibility = 'hidden';
    });
  }
  show() {
    return this.target.getByTestId('main-menu').evaluate((el) => {
      el.style.visibility = 'unset';
    });
  }
  hideUserWallet() {
    const userWalletSelector = '[data-testid=user-wallet]';
    return this.target
      .locator(userWalletSelector)
      .isVisible()
      .then((isVisible) => {
        if (!isVisible) return;
        const userWallet = this.target.getByTestId('user-wallet');
        return userWallet.evaluate((el) => {
          el.style.fontFamily = 'monospace';
          el.style.visibility = 'hidden';
        });
      });
  }
  showUserWallet() {
    const userWalletSelector = '[data-testid=user-wallet]';
    return this.target
      .locator(userWalletSelector)
      .isHidden() // Checks element is hidden OR not present
      .then((isHidden) => {
        if (!isHidden) return;
        const userWallet = this.target.getByTestId('user-wallet');
        return userWallet.evaluate((el) => {
          el.style.fontFamily = 'unset';
          el.style.visibility = 'unset';
        });
      });
  }
}
