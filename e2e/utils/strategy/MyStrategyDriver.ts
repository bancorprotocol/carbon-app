import { waitFor } from './../../utils/operators';
import { Page } from 'playwright-core';
import { Direction } from '../types';
import { MainMenuDriver } from '../MainMenuDriver';

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
      pairBase: () => strategy.getByTestId('pair-base'),
      pairQuote: () => strategy.getByTestId('pair-quote'),
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
        // Note: we cannot hover polygon on overlapping because of the form, we need to force hover on line
        if (options.isOverlapping) {
          const polygon = strategy.getByTestId(`polygon-${direction}`);
          if (direction === 'buy') {
            await polygon.locator('line').first().hover({ force: true });
          } else {
            await polygon.locator('line').last().hover({ force: true });
          }
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
        try {
          await this.page
            .getByTestId(`manage-strategy-${id}`)
            .click({ timeout: 2_000 });
        } catch {
          // Usually this happens because dropdown is below header.
          // Hide header, scroll, click and show header again
          const mainMenu = new MainMenuDriver(this.page);
          await mainMenu.hide();
          await strategy.scrollIntoViewIfNeeded();
          await this.page.getByTestId(`manage-strategy-${id}`).click();
          await mainMenu.show();
        }
      },
    };
  }

  createStrategy() {
    return this.page.getByTestId('trade-page').click();
  }
}
