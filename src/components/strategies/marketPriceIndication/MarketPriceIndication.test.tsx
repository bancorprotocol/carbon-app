import { test, expect, describe, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { SafeDecimal } from 'libs/safedecimal';
import { MarketPriceIndication } from './index';

describe('MarketPriceIndication', () => {
  afterEach(() => {
    cleanup(); // Clear the screen before each test
  });

  test('renders the market price indication correctly for positive percentage', () => {
    const marketPricePercentage = new SafeDecimal(5);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    const indicationText = screen.getByText('5.00% above market');
    expect(indicationText).toBeInTheDocument();
  });

  test('renders the market price indication correctly for positive percentage - greater than 99.99', () => {
    const marketPricePercentage = new SafeDecimal(100);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    const indicationText = screen.getByText('>99.99% above market');
    expect(indicationText).toBeInTheDocument();
  });

  test('renders the market price indication correctly for positive percentage - smaller than 0.01', () => {
    const marketPricePercentage = new SafeDecimal(0.001);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    const indicationText = screen.getByText('<0.01% above market');
    expect(indicationText).toBeInTheDocument();
  });

  test('renders the market price indication correctly for negative percentage', () => {
    const marketPricePercentage = new SafeDecimal(-6);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    const indicationText = screen.getByText('6.00% below market');
    expect(indicationText).toBeInTheDocument();
  });

  test('renders the market price indication correctly for negative percentage - lower than 99.99', () => {
    const marketPricePercentage = new SafeDecimal(-100);
    render(
      <MarketPriceIndication marketPricePercentage={marketPricePercentage} />
    );

    const indicationText = screen.getByText('99.99% below market');
    expect(indicationText).toBeInTheDocument();
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

    const indicationText = screen.getByText('3.10% above');
    expect(indicationText).toBeInTheDocument();
  });

  test('renders the market price indication with range text when isRange = true & negative', () => {
    const marketPricePercentage = new SafeDecimal(-3.12345);
    render(
      <MarketPriceIndication
        marketPricePercentage={marketPricePercentage}
        isRange={true}
      />
    );

    const indicationText = screen.getByText('3.12% below');
    expect(indicationText).toBeInTheDocument();
  });
});
