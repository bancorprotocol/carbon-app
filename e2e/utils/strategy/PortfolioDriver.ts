import { Page } from '@playwright/test';

export class PortfolioDriver {
  constructor(private page: Page) {}
  async tabInto(path: 'strategies' | 'pairs' | 'distribution' | 'activity') {
    await this.page.getByTestId(`${path}-tab`).click();
    await this.page.waitForURL(`/*/${path}`);
  }
}
