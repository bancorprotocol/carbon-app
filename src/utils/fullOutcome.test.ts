import { describe, it, expect } from 'vitest';
import { FullOutcomeParams, geoMean, getFullOutcome } from 'utils/fullOutcome';
import { SafeDecimal } from 'libs/safedecimal';

describe('fullOutcome', () => {
  describe('Geo Mean', () => {
    it('should return undefined if string values are not numbers', () => {
      expect(geoMean('a', '0')).toBeUndefined();
      expect(geoMean('0', 'a')).toBeUndefined();
      expect(geoMean('0', undefined as any)).toBeUndefined();
      expect(geoMean('0', null as any)).toBeUndefined();
    });
    it('should return undefined if no min or max is provided', () => {
      expect(geoMean('', '')).toBeUndefined();
      expect(geoMean('', '10')).toBeUndefined();
      expect(geoMean('10', '')).toBeUndefined();
    });
    it('should return undefined if min or max is 0 or negative', () => {
      expect(geoMean('0', '10')).toBeUndefined();
      expect(geoMean('-100', '10')).toBeUndefined();
      expect(geoMean('-100', '-10')).toBeUndefined();
    });
    it('should return same price for limit price', () => {
      expect(geoMean('100', '100')).toEqual(new SafeDecimal('100'));
    });

    it('should return mean price for range price', () => {
      const mean = new SafeDecimal('158.1138830084189666');
      expect(geoMean('100', '250')).toEqual(mean);
    });
  });

  describe('Full Outcome', () => {
    const base: FullOutcomeParams = {
      budget: '1',
      min: '',
      max: '',
      price: '',
      buy: true,
    };
    it('should return undefined if no budget, 0 or a negative value', () => {
      const input = {
        buy: true,
        price: '1',
        min: '100',
        max: '10',
        budget: '',
      };
      expect(getFullOutcome(input)).toBeUndefined();
      expect(getFullOutcome({ ...input, budget: '0' })).toBeUndefined();
      expect(getFullOutcome({ ...input, budget: '-1' })).toBeUndefined();
    });
    it('should return undefined if neither price nor min&max', () => {
      const noPriceOrMinAndMax = { ...base, price: '', min: '', max: '' };
      const noPriceAndMax = { ...base, price: '', min: '10', max: '' };
      expect(getFullOutcome(noPriceOrMinAndMax)).toBeUndefined();
      expect(getFullOutcome(noPriceAndMax)).toBeUndefined();
    });
    describe('Limit rate', () => {
      it('[Buy] should return 3.1645569620253164557 with price 1580 & budget 5000', () => {
        const input = { ...base, price: '1580', budget: '5000' };
        expect(getFullOutcome(input)?.amount).toBe('3.1645569620253164557');
      });
      it('[Buy] should return 2 with price 1600 & budget 3200', () => {
        const input = { ...base, price: '1600', budget: '3200' };
        expect(getFullOutcome(input)?.amount).toBe('2');
      });
      it('[Buy] should return 3 with price 1500 & budget 4500 ', () => {
        const input = { ...base, price: '1500', budget: '4500' };
        expect(getFullOutcome(input)?.amount).toBe('3');
      });
      it('[Sell] should return 3260 with price 1630 & budget 2', () => {
        const input = { ...base, buy: false, price: '1630', budget: '2' };
        expect(getFullOutcome(input)?.amount).toBe('3260');
      });
    });
    describe('Range rate', () => {
      it('[Buy] should return 1.8353258709644941273 with min 1600, max 1900 & budget 3200', () => {
        const input = {
          ...base,
          min: '1600',
          max: '1900',
          budget: '3200',
        };
        expect(getFullOutcome(input)?.amount).toBe('1.8353258709644941273');
      });
      it('[Sell] should return 4623.3105022267323378 with min 1800, max 1900 & budget 2.5', () => {
        const input = {
          ...base,
          buy: false,
          min: '1800',
          max: '1900',
          budget: '2.5',
        };
        expect(getFullOutcome(input)?.amount).toBe('4623.3105022267323378');
      });
    });
  });
});
