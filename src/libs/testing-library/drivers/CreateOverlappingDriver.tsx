import { Screen, within } from '@testing-library/dom';

export class CreateOverlappingDriver {
  constructor(private screen: Screen) {}

  getStrategyChart() {
    return {
      closeChart: () => this.screen.getByTestId('close-chart'),
      openChart: () => this.screen.getByTestId('open-chart'),
      chart: () => this.screen.queryByTestId('strategy-chart'),
    };
  }

  getOverlappingForm() {
    return this.screen.getByTestId('create-strategy-step');
  }

  getOverlappingInput() {
    const form = this.getOverlappingForm();
    return {
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

  getUserPriceForm() {
    return this.screen.getByTestId('user-price-form');
  }

  getUserPriceInput() {
    return {
      open: () => this.screen.getByTestId('edit-market-price'),
      editPrice: () =>
        within(this.getUserPriceForm()).getByTestId('input-price'),
      approveWarning: () =>
        within(this.getUserPriceForm()).getByTestId('approve-price-warnings'),
      confirm: () =>
        within(this.getUserPriceForm()).getByTestId('set-overlapping-price'),
    };
  }
}
