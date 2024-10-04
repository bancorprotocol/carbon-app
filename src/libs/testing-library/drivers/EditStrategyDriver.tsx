import {
  Screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/dom';

export class EditStrategyDriver {
  constructor(private screen: Screen) {}

  findForm() {
    return this.screen.findByTestId('edit-form');
  }

  async findDisposableForm() {
    const form = await this.findForm();
    return {
      element: form,
      min: () => within(form).getByTestId('input-min'),
      max: () => within(form).getByTestId('input-max'),
      price: () => within(form).getByTestId('input-price'),
      tabSell: () => within(form).getByTestId('tab-sell'),
      tabBuy: () => within(form).getByTestId('tab-buy'),
      limit: () => within(form).getByTestId('tab-limit'),
      range: () => within(form).getByTestId('tab-range'),
      budgetSummary: () => within(form).getByTestId('budget-summary'),
      budget: () => within(form).getByTestId('input-budget'),
      distributeBudget: () => within(form).queryByTestId('distribute-budget'),
      marketPriceIndicators: () =>
        within(form).queryAllByTestId('market-price-indication'),
      approveWarnings: () => within(form).queryByTestId('approve-warnings'),
      submit: () => within(form).getByTestId('edit-submit'),
    };
  }

  async findRecurringForm() {
    const form = await this.findForm();
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
        budgetSummary: () => within(buySection).getByTestId('budget-summary'),
        marketPriceIndicators: () =>
          within(buySection).queryAllByTestId('market-price-indication'),
        distributeBudget: () =>
          within(buySection).queryByTestId('distribute-budget'),
      },
      sell: {
        min: () => within(sellSection).getByTestId('input-min'),
        max: () => within(sellSection).getByTestId('input-max'),
        price: () => within(sellSection).getByTestId('input-price'),
        limit: () => within(sellSection).getByTestId('tab-limit'),
        range: () => within(sellSection).getByTestId('tab-range'),
        budget: () => within(sellSection).getByTestId('input-budget'),
        budgetSummary: () => within(sellSection).getByTestId('budget-summary'),
        distributeBudget: () =>
          within(sellSection).queryByTestId('distribute-budget'),
        marketPriceIndicators: () =>
          within(sellSection).queryAllByTestId('market-price-indication'),
      },
      approveWarnings: () => within(form).queryByTestId('approve-warnings'),
      submit: () => within(form).getByTestId('edit-submit'),
    };
  }

  async findOverlappingForm() {
    const form = await this.findForm();
    const getByTestId = (id: string) => within(form).getByTestId(id);
    const queryByTestId = (id: string) => within(form).queryByTestId(id);
    return {
      element: form,
      min: () => getByTestId('input-min'),
      minMarketPrice: () => getByTestId('market-price-min'),
      max: () => getByTestId('input-max'),
      maxMarketPrice: () => getByTestId('market-price-max'),
      spread: {
        input: () => getByTestId('spread-input'),
        default: () => getByTestId('spread-0.05'),
        option: (value: string) => getByTestId(`spread-${value}`),
      },
      anchorRequired: () => within(form).queryByTestId('require-anchor'),
      anchor: (anchor: 'buy' | 'sell') => getByTestId(`anchor-${anchor}`),
      budget: () => getByTestId('input-budget'),
      marketPriceIndicators: () =>
        within(form).queryAllByTestId('market-price-indication'),
      deposit: (symbol: string) => queryByTestId(`deposit-${symbol}`),
      withdraw: (symbol: string) => queryByTestId(`withdraw-${symbol}`),
      approveWarnings: () => queryByTestId('approve-warnings'),
      submit: () => getByTestId('edit-submit'),
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
