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
}
