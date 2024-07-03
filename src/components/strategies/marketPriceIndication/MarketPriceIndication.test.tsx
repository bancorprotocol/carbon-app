import { test, expect, describe } from 'vitest';
import { render, screen } from 'libs/testing-library';
import { SafeDecimal } from 'libs/safedecimal';
import { MarketPriceIndication } from './index';

describe('MarketPriceIndication', () => {
  test('renders the market price indication correctly for positive percentage', () => {
    const marketPricePercentage = new SafeDecimal(5);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    screen.findByText('5.00% above market');
  });

  test('renders the market price indication correctly for positive percentage - greater than 99.99', () => {
    const marketPricePercentage = new SafeDecimal(100);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    screen.findByText('>99.99% above market');
  });

  test('renders the market price indication correctly for positive percentage - smaller than 0.01', () => {
    const marketPricePercentage = new SafeDecimal(0.001);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    screen.findByText('<0.01% above market');
  });

  test('renders the market price indication correctly for negative percentage', () => {
    const marketPricePercentage = new SafeDecimal(-6);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    screen.findByText('6.00% below market');
  });

  test('renders the market price indication correctly for negative percentage - lower than 99.99', () => {
    const marketPricePercentage = new SafeDecimal(-100);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    screen.findByText('99.99% below market');
  });

  test('renders the market price indication correctly for zero percentage', async () => {
    const marketPricePercentage = new SafeDecimal(0);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    const component = screen.queryByTestId('market-price-indication');
    expect(component).not.toBeInTheDocument();
  });

  test('renders the market price indication with range text when isRange = true & positive', () => {
    const marketPricePercentage = new SafeDecimal(3.1);
    render(
      <MarketPriceIndication
        marketPricePercentage={marketPricePercentage}
        isRange={true}
      />
    );

    screen.findByText('3.10% above');
  });

  test('renders the market price indication with range text when isRange = true & negative', () => {
    const marketPricePercentage = new SafeDecimal(-3.12345);
    render(
      <MarketPriceIndication
        marketPricePercentage={marketPricePercentage}
        isRange={true}
      />
    );

    screen.findByText('3.12% below');
  });
});
