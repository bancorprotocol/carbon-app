import { describe, test, expect } from 'vitest';
import { createDebugStrategy } from './template';

describe('Test create strategy template', () => {
  // Recurring Limit
  test('recurringLimitBuy', () => {
    const strategy = createDebugStrategy.recurringLimitBuy('ETH->DAI', {
      price: '100',
      budget: '100',
    });
    expect(strategy).toEqual({
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '100',
        max: '100',
        budget: '100',
      },
      sell: {
        min: '0',
        max: '0',
        budget: '0',
      },
    });
  });
  test('recurringLimitSell', () => {
    const strategy = createDebugStrategy.recurringLimitSell('ETH->DAI', {
      price: '100',
      budget: '100',
    });
    expect(strategy).toEqual({
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '0',
        max: '0',
        budget: '0',
      },
      sell: {
        min: '100',
        max: '100',
        budget: '100',
      },
    });
  });
  test('recurringLimitBuySell', () => {
    const strategy = createDebugStrategy.recurringLimitBuySell(
      'ETH->DAI',
      {
        price: '100',
        budget: '100',
      },
      {
        price: '200',
        budget: '100',
      }
    );
    expect(strategy).toEqual({
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '100',
        max: '100',
        budget: '100',
      },
      sell: {
        min: '200',
        max: '200',
        budget: '100',
      },
    });
  });
  // Recurring Range
  test('recurringRangeBuy', () => {
    const strategy = createDebugStrategy.recurringRangeBuy('ETH->DAI', {
      min: '100',
      max: '200',
      budget: '100',
    });
    expect(strategy).toEqual({
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '100',
        max: '200',
        budget: '100',
      },
      sell: {
        min: '0',
        max: '0',
        budget: '0',
      },
    });
  });
  test('recurringRangeSell', () => {
    const strategy = createDebugStrategy.recurringRangeSell('ETH->DAI', {
      min: '100',
      max: '200',
      budget: '100',
    });
    expect(strategy).toEqual({
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '0',
        max: '0',
        budget: '0',
      },
      sell: {
        min: '100',
        max: '200',
        budget: '100',
      },
    });
  });
  test('recurringRangeBuySell', () => {
    const strategy = createDebugStrategy.recurringRangeBuySell(
      'ETH->DAI',
      {
        min: '100',
        max: '200',
        budget: '100',
      },
      {
        min: '300',
        max: '400',
        budget: '100',
      }
    );
    expect(strategy).toEqual({
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '100',
        max: '200',
        budget: '100',
      },
      sell: {
        min: '300',
        max: '400',
        budget: '100',
      },
    });
  });
  // Overlapping
  test('overlapping', () => {
    const strategy = createDebugStrategy.overlapping({
      pair: 'ETH->DAI',
      buyMin: '100',
      sellMax: '200',
      buyBudget: '100',
      sellBudget: '10',
      spread: '1',
    });
    expect(strategy).toEqual({
      base: 'ETH',
      quote: 'DAI',
      buy: {
        min: '100',
        max: '198.01980198019803',
        budget: '100',
      },
      sell: {
        min: '101',
        max: '200',
        budget: '10',
      },
      spread: '1',
    });
  });
});
