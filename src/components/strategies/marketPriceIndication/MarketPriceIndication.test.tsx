import { test, expect, describe, beforeEach, vitest } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { MarketPriceIndication } from './index';
import { I18nextProvider, i18n, initReactI18next } from 'libs/translations';

i18n.use(initReactI18next).init({
  lng: 'en-US',
  ns: ['translationsNS'],
  defaultNS: 'translationsNS',
  resources: {
    'en-US': {
      translationsNS: {
        common: {
          tooltips: {
            tooltip8:
              'The percentage difference between the input price and the current market price of the token',
          },
          contents: {
            content11: '{{percentage}}% below',
            content12: '{{percentage}}% above',
            content13: '{{percentage}}% below market',
            content14: '{{percentage}}% above market',
          },
        },
      },
    },
  },
});

vitest.mock('components/common/tooltip/Tooltip', () => ({
  Tooltip: vitest.fn(({ element }) => <div>{element}</div>),
}));

vitest.mock('./useMarketIndication.ts', () => ({
  Tooltip: vitest.fn(() => null),
}));

describe('MarketPriceIndication', () => {
  beforeEach(() => {
    cleanup(); // Clear the screen before each test
  });

  test('renders the market price indication correctly for positive percentage', () => {
    const marketPricePercentage = new BigNumber(5);
    render(
      <I18nextProvider i18n={i18n}>
        <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
      </I18nextProvider>
    );

    const indicationText = screen.getByText('5.00% above market');
    expect(indicationText).toBeTruthy();
  });

  test('renders the market price indication correctly for positive percentage - greater than 99.99', () => {
    const marketPricePercentage = new BigNumber(100);
    render(
      <I18nextProvider i18n={i18n}>
        <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
      </I18nextProvider>
    );

    const indicationText = screen.getByText('>99.99% above market');
    expect(indicationText).toBeTruthy();
  });

  test('renders the market price indication correctly for positive percentage - smaller than 0.01', () => {
    const marketPricePercentage = new BigNumber(0.001);
    render(
      <I18nextProvider i18n={i18n}>
        <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
      </I18nextProvider>
    );

    const indicationText = screen.getByText('<0.01% above market');
    expect(indicationText).toBeTruthy();
  });

  test('renders the market price indication correctly for negative percentage', () => {
    const marketPricePercentage = new BigNumber(-6);
    render(
      <I18nextProvider i18n={i18n}>
        <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
      </I18nextProvider>
    );

    const indicationText = screen.getByText('6.00% below market');
    expect(indicationText).toBeTruthy();
  });

  test('renders the market price indication correctly for negative percentage - lower than 99.99', () => {
    const marketPricePercentage = new BigNumber(-100);
    render(
      <I18nextProvider i18n={i18n}>
        <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
      </I18nextProvider>
    );

    const indicationText = screen.getByText('99.99% below market');
    expect(indicationText).toBeTruthy();
  });

  test('renders the market price indication correctly for zero percentage', async () => {
    const marketPricePercentage = new BigNumber(0);
    render(
      <I18nextProvider i18n={i18n}>
        <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
      </I18nextProvider>
    );

    const component = screen.queryByTestId('market-price-indication');
    expect(component).toBeNull();
  });

  test('renders the market price indication with range text when isRange = true & positive', () => {
    const marketPricePercentage = new BigNumber(3.1);
    render(
      <I18nextProvider i18n={i18n}>
        <MarketPriceIndication
          marketPricePercentage={marketPricePercentage}
          isRange={true}
        />
      </I18nextProvider>
    );

    const indicationText = screen.getByText('3.10% above');
    expect(indicationText).toBeTruthy();
  });

  test('renders the market price indication with range text when isRange = true & negative', () => {
    const marketPricePercentage = new BigNumber(-3.12345);
    render(
      <I18nextProvider i18n={i18n}>
        <MarketPriceIndication
          marketPricePercentage={marketPricePercentage}
          isRange={true}
        />
      </I18nextProvider>
    );

    const indicationText = screen.getByText('3.12% below');
    expect(indicationText).toBeTruthy();
  });
});
