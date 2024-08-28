import {
  Screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/dom';

export class CreateStrategyDriver {
  constructor(private screen: Screen) {}

  async findCreateForm() {
    return this.screen.findByTestId('create-strategy-form');
  }

  async findDisposableForm() {
    const form = await this.findCreateForm();
    return {
      element: form,
      min: () => within(form).getByTestId('input-min'),
      max: () => within(form).getByTestId('input-max'),
      price: () => within(form).getByTestId('input-price'),
      tabSell: () => within(form).getByTestId('tab-sell'),
      tabBuy: () => within(form).getByTestId('tab-buy'),
      limit: () => within(form).getByTestId('tab-limit'),
      range: () => within(form).getByTestId('tab-range'),
      budget: () => within(form).getByTestId('input-budget'),
      marketPriceIndicators: () =>
        within(form).queryAllByTestId('market-price-indication'),
      approveWarnings: () => within(form).queryByTestId('approve-warnings'),
      submit: () => within(form).getByTestId('create-strategy'),
    };
  }

  async findRecurringForm() {
    const form = await this.findCreateForm();
    const buySection = within(form).getByTestId('buy-section');
    const sellSection = within(form).getByTestId('sell-section');
    return {
      element: form,
      buy: {
        min: () => within(buySection).getByTestId('input-min'),
        max: () => within(buySection).getByTestId('input-max'),
        price: () => within(buySection).getByTestId('input-price'),
        limit: () => within(buySection).getByTestId('tab-limit'),
        range: () => within(buySection).getByTestId('tab-range'),
        budget: () => within(buySection).getByTestId('input-budget'),
        marketPriceIndicators: () =>
          within(buySection).queryAllByTestId('market-price-indication'),
      },
      sell: {
        min: () => within(sellSection).getByTestId('input-min'),
        max: () => within(sellSection).getByTestId('input-max'),
        price: () => within(sellSection).getByTestId('input-price'),
        limit: () => within(sellSection).getByTestId('tab-limit'),
        range: () => within(sellSection).getByTestId('tab-range'),
        budget: () => within(sellSection).getByTestId('input-budget'),
        marketPriceIndicators: () =>
          within(sellSection).queryAllByTestId('market-price-indication'),
      },
      approveWarnings: () => within(form).queryByTestId('approve-warnings'),
      submit: () => within(form).getByTestId('create-strategy'),
    };
  }

  async findOverlappingForm() {
    const form = await this.findCreateForm();
    return {
      element: form,
      min: () => within(form).getByTestId('input-min'),
      max: () => within(form).getByTestId('input-max'),
      spread: {
        input: () => within(form).getByTestId('spread-input'),
        default: () => within(form).getByTestId('spread-0.05'),
        option: (value: string) => within(form).getByTestId(`spread-${value}`),
      },
      anchorRequired: () => within(form).queryByTestId('require-anchor'),
      anchor: (anchor: 'buy' | 'sell') =>
        within(form).getByTestId(`anchor-${anchor}`),
      budget: () => within(form).getByTestId('input-budget'),
      marketPriceIndicators: () =>
        within(form).queryAllByTestId('market-price-indication'),
      approveWarnings: () => within(form).queryByTestId('approve-warnings'),
      submit: () => within(form).getByTestId('create-strategy'),
    };
  }

  async findUserPriceForm() {
    return this.screen.findByTestId('user-price-form');
  }

  async findEditMarketPrice() {
    return this.screen.findByTestId('edit-market-price');
  }

  async findUserPriceInput() {
    const priceForm = await this.findUserPriceForm();
    return {
      editPrice: () => within(priceForm).getByTestId('input-price'),
      approveWarning: () =>
        within(priceForm).getByTestId('approve-price-warnings'),
      confirm: () => within(priceForm).getByTestId('set-overlapping-price'),
    };
  }

  waitForLoading(parent: HTMLElement) {
    const loadings = parent.querySelectorAll('.loading-message');
    const waitForAll = Array.from(loadings).map((loading) => {
      return waitForElementToBeRemoved(() => loading);
    });
    return Promise.all(waitForAll);
  }
}
