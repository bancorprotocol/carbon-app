import { Page } from 'playwright-core';

export class MyStrategyDriver {
  constructor(private page: Page) {}

  firstStrategy() {
    return this.page.getByTestId('first-strategy');
  }

  async getAllStrategies() {
    const strategies = this.page.locator('[data-testid="strategy-list"] > li');
    await strategies.waitFor({ state: 'visible' });
    return strategies;
  }

  async getStrategy(index: number) {
    const selector = `[data-testid="strategy-list"] > li:nth-child(${index})`;
    const strategy = this.page.locator(selector);
    return {
      pair: () => strategy.getByTestId('token-pair'),
      status: () => strategy.getByTestId('status'),
      totalBudget: () => strategy.getByTestId('total-budget'),
      buyBudget: () => strategy.getByTestId('buy-budget'),
      buyBudgetFiat: () => strategy.getByTestId('buy-budget-fiat'),
      sellBudget: () => strategy.getByTestId('sell-budget'),
      sellBudgetFiat: () => strategy.getByTestId('sell-budget-fiat'),
      priceTooltip: async (mode: 'buy' | 'sell') => {
        await strategy.getByTestId(`polygon-${mode}`).hover();
        const tooltip = this.page.getByTestId('order-tooltip');
        return {
          minPrice: () => tooltip.getByTestId('min-price'),
          maxPrice: () => tooltip.getByTestId('max-price'),
          marginalPrice: () => tooltip.getByTestId('marginal-price'),
        };
      },
    };
  }

  createStrategy() {
    return this.page.getByTestId('create-strategy-desktop').click();
  }
}
