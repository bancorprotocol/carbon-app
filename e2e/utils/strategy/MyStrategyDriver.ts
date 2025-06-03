import { waitFor } from './../../utils/operators';
import { Page } from 'playwright-core';
import { Direction } from '../types';

// TODO import type `StrategyEditOptionId`
type ManageStrategyID =
  | 'duplicateStrategy'
  | 'manageNotifications'
  | 'walletOwner'
  | 'depositFunds'
  | 'pauseStrategy'
  | 'renewStrategy'
  | 'editPrices'
  | 'deleteStrategy'
  | 'withdrawFunds';

export class MyStrategyDriver {
  constructor(private page: Page) {}

  async waitForUpdates(timeout = 2_000) {
    try {
      const indicator = this.page.getByTestId('fetch-strategies');
      await indicator.waitFor({ state: 'attached', timeout });
      return indicator.waitFor({ state: 'detached' });
    } catch {
      // Do nothing
    }
  }

  firstStrategy() {
    return this.page.getByTestId('first-strategy');
  }

  getAllStrategies() {
    return this.page.locator('[data-testid="strategy-list"] > li');
  }

  async getStrategy(index: number) {
    const selector = `[data-testid="strategy-list"] > li:nth-child(${index})`;
    const strategy = this.page.locator(selector);
    return {
      pair: () => strategy.getByTestId('token-pair'),
      status: () => strategy.getByTestId('status'),
      totalBudget: () => strategy.getByTestId('total-budget'),
      budget: (direction: Direction) => {
        return strategy.getByTestId(`${direction}-budget`);
      },
      budgetFiat: (direction: Direction) => {
        return strategy.getByTestId(`${direction}-budget-fiat`);
      },
      priceTooltip: async (
        direction: Direction,
        options: { isOverlapping: boolean } = { isOverlapping: false },
      ) => {
        // Note: locator.hover() doesn't work because of polygon form I think
        if (options.isOverlapping) {
          const position = await strategy
            .getByTestId(`polygon-${direction}`)
            .boundingBox();
          if (!position?.x || !position?.y) throw new Error('No polygon found');
          const x =
            direction === 'buy'
              ? position.x + 2
              : position.x + position.width - 2;
          const y = position.y + 2;
          await this.page.mouse.move(x, y);
        } else {
          await strategy.getByTestId(`polygon-${direction}`).hover();
        }
        const tooltip = this.page.getByTestId('order-tooltip');
        await tooltip.waitFor({ state: 'visible' });
        return {
          price: () => tooltip.getByTestId('price'),
          minPrice: () => tooltip.getByTestId('min-price'),
          maxPrice: () => tooltip.getByTestId('max-price'),
          spread: () => tooltip.getByTestId('spread'),
          marginalPrice: () => tooltip.getByTestId('marginal-price'),
          waitForDetached: async () => {
            await this.page.mouse.move(0, 0);
            await tooltip.waitFor({ state: 'detached' });
          },
        };
      },
      clickManageEntry: async (id: ManageStrategyID) => {
        await strategy.getByTestId('manage-strategy-btn').click();
        await waitFor(this.page, 'manage-strategy-dropdown', 10_000);
        await this.page.getByTestId(`manage-strategy-${id}`).click();
      },
    };
  }

  createStrategy() {
    return this.page.getByTestId('trade-page').click();
  }
}
