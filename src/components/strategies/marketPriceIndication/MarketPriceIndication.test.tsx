import { test, expect, describe } from 'vitest';
import { render, screen } from 'libs/testing-library';
import { SafeDecimal } from 'libs/safedecimal';
import { MarketPricePercent } from './index';

describe('MarketPricePercent', () => {
  test('renders the market price indication correctly for positive percentage', () => {
    const marketPricePercentage = new SafeDecimal(5);
    render(
      <MarketPricePercent marketPricePercentage={marketPricePercentage} />,
    );

    screen.findByText('+5.00%');
  });

  test('renders the market price indication correctly for positive percentage - greater than 99.99', () => {
    const marketPricePercentage = new SafeDecimal(100);
    render(
      <MarketPricePercent marketPricePercentage={marketPricePercentage} />,
    );

    screen.findByText('>+99.99%');
  });

  test('renders the market price indication correctly for positive percentage - smaller than 0.01', () => {
    const marketPricePercentage = new SafeDecimal(0.001);
    render(
      <MarketPricePercent marketPricePercentage={marketPricePercentage} />,
    );

    screen.findByText('+<0.01%');
  });

  test('renders the market price indication correctly for negative percentage', () => {
    const marketPricePercentage = new SafeDecimal(-6);
    render(
      <MarketPricePercent marketPricePercentage={marketPricePercentage} />,
    );

    screen.findByText('-6.00%');
  });

  test('renders the market price indication correctly for negative percentage - lower than 99.99', () => {
    const marketPricePercentage = new SafeDecimal(-100);
    render(
      <MarketPricePercent marketPricePercentage={marketPricePercentage} />,
    );

    screen.findByText('<-99.99%');
  });

  test('renders the market price indication correctly for zero percentage', async () => {
    const marketPricePercentage = new SafeDecimal(0);
    render(
      <MarketPricePercent marketPricePercentage={marketPricePercentage} />,
    );

    const component = screen.queryByTestId('market-price-indication');
    expect(component).not.toBeInTheDocument();
  });
});
