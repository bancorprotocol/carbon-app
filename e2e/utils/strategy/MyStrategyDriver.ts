import { waitFor } from './../../utils/operators';
import { Page } from 'playwright-core';

// TODO import type `StrategyEditOptionId`
type IDs =
  | 'duplicateStrategy'
  | 'manageNotifications'
  | 'walletOwner'
  | 'depositFunds'
  | 'pauseStrategy'
  | 'renewStrategy'
  | 'editPrices'
  | 'deleteStrategy'
  | 'withdrawFunds';
type ManageStrategyID = `manage-strategy-${IDs}`;

export class MyStrategyDriver {
  constructor(private page: Page) {}

  firstStrategy() {
    return this.page.getByTestId('first-strategy');
  }

  async getAllStrategies() {
    return this.page.locator('[data-testid="strategy-list"] > li');
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
        // Note: locator.hover() doesn't work because of polygon form I think
        const position = await strategy
          .getByTestId(`polygon-${mode}`)
          .boundingBox();
        if (!position?.x || !position?.y) throw new Error('No polygon found');
        const x =
          mode === 'buy' ? position.x + 2 : position.x + position.width - 2;
        const y = position.y + 2;
        await this.page.mouse.move(x, y);
        const tooltip = this.page.getByTestId('order-tooltip');
        return {
          minPrice: () => tooltip.getByTestId('min-price'),
          maxPrice: () => tooltip.getByTestId('max-price'),
          marginalPrice: () => tooltip.getByTestId('marginal-price'),
        };
      },
      clickManageEntry: async (id: ManageStrategyID) => {
        await strategy.getByTestId('manage-strategy-btn').click();
        await waitFor(this.page, 'manage-strategy-dropdown', 10_000);
        await this.page.getByTestId(id).click();
      },
    };
  }

  createStrategy() {
    return this.page.getByTestId('create-strategy-desktop').click();
  }
}
