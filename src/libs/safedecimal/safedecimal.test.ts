import { SafeDecimal } from '.';
import { describe, it, expect } from 'vitest';

describe('SafeDecimal', () => {
  describe('valid input', () => {
    it('should return a Decimal if input is valid string', () => {
      expect(new SafeDecimal('4321123122321')).toEqual(
        new SafeDecimal('4321123122321')
      );
      expect(new SafeDecimal('42.5').toString()).toEqual('42.5');
      expect(new SafeDecimal('0.425').toString()).toEqual('0.425');
      expect(new SafeDecimal('.425').toString()).toEqual('0.425');
    });
    it('should return a SafeDecimal if input is valid number', () => {
      expect(new SafeDecimal(4321123122321).toString()).toEqual(
        '4321123122321'
      );
      expect(new SafeDecimal(42.5).toString()).toEqual('42.5');
      expect(new SafeDecimal(0.0425).toString()).toEqual('0.0425');
    });
  });
  describe('invalid input', () => {
    it('should return NaN for invalid input', () => {
      expect(new SafeDecimal('...').toString()).toStrictEqual('NaN');
      expect(new SafeDecimal('.').toString()).toEqual('NaN');
      expect(new SafeDecimal('text').toString()).toEqual('NaN');
    });
    it('should return NaN for empty string input', () => {
      expect(new SafeDecimal('').toString()).toEqual('NaN');
    });
  });
  describe('other input', () => {
    it('should remove whitespace before and after a number', () => {
      expect(new SafeDecimal(' 12345 ').toString()).toEqual('12345');
    });
  });
  describe('operations', () => {
    it('should return valid operation output with valid input', () => {
      expect(new SafeDecimal('123123').add('12321').toString()).toEqual(
        '135444'
      );
    });
    it('should return NaN when using invalid input', () => {
      expect(new SafeDecimal('').abs().toString()).toEqual('NaN');
      expect(new SafeDecimal('123123').add('').toString()).toEqual('NaN');
      expect(new SafeDecimal('123123').sub('').toString()).toEqual('NaN');
      expect(new SafeDecimal('123123').times('').toString()).toEqual('NaN');
      expect(new SafeDecimal('123123').greaterThan('')).toEqual(false);
    });
  });
});
