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
        within(form).getAllByTestId('market-price-indication'),
      approveWarnings: () => within(form).queryByTestId('approve-warnings'),
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
