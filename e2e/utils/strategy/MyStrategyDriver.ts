import { Page } from 'playwright-core';

export class MyStrategyDriver {
  constructor(private page: Page) {}
  async getAllStrategy() {
    const strategies = this.page.locator('[data-testid="strategy-list"] > li');
    await strategies.waitFor({ state: 'visible' });
    return strategies.all();
  }
}
