import { describe, test, expect } from 'vitest';
import { createDebugStrategy } from './utils';

describe('Test create strategy template', () => {
  // Limit
  test('limitBuy', () => {
    const strategy = createDebugStrategy.limitBuy('ETH->DAI', {
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
  test('limitSell', () => {
    const strategy = createDebugStrategy.limitSell('ETH->DAI', {
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
  test('limitBuySell', () => {
    const strategy = createDebugStrategy.limitBuySell(
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
  // Range
  test('rangeBuy', () => {
    const strategy = createDebugStrategy.rangeBuy('ETH->DAI', {
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
  test('rangeSell', () => {
    const strategy = createDebugStrategy.rangeSell('ETH->DAI', {
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
  test('rangeBuySell', () => {
    const strategy = createDebugStrategy.rangeBuySell(
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
