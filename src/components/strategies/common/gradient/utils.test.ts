import { describe, expect, it } from 'vitest';
import { isReverseGradientOrders } from './utils';

describe('isReverseGradientOrders', () => {
  // @todo(gradient)
  // it('should return true if buy line is above sell line', () => {
  //   const buy = {
  //     _sD_: '0',
  //     _eD_: '10',
  //     _sP_: '2',
  //     _eP_: '8',
  //   };
  //   const sell = {
  //     _sD_: '2',
  //     _eD_: '12',
  //     _sP_: '5',
  //     _eP_: '3',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  it('should return false if buy line is below sell line', () => {
    const buy = {
      _sD_: '0',
      _eD_: '10',
      _sP_: '2',
      _eP_: '4',
    };
    const sell = {
      _sD_: '2',
      _eD_: '12',
      _sP_: '5',
      _eP_: '7',
    };
    expect(isReverseGradientOrders(buy, sell)).toBe(false);
  });

  it('should return false if lines do not overlap', () => {
    const buy = {
      _sD_: '0',
      _eD_: '10',
      _sP_: '2',
      _eP_: '4',
    };
    const sell = {
      _sD_: '12',
      _eD_: '20',
      _sP_: '5',
      _eP_: '7',
    };
    expect(isReverseGradientOrders(buy, sell)).toBe(false);
  });

  // @todo(gradient)
  // it('should return true if buy line slopes downwards and overlaps', () => {
  //   const buy = {
  //     _sD_: '0',
  //     _eD_: '10',
  //     _sP_: '8',
  //     _eP_: '2',
  //   };
  //   const sell = {
  //     _sD_: '2',
  //     _eD_: '12',
  //     _sP_: '5',
  //     _eP_: '7',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  it('should return false if overlap only occurs at one point and buy is not above sell', () => {
    const buy = {
      _sD_: '0',
      _eD_: '10',
      _sP_: '2',
      _eP_: '4',
    };
    const sell = {
      _sD_: '10',
      _eD_: '20',
      _sP_: '5',
      _eP_: '7',
    };
    expect(isReverseGradientOrders(buy, sell)).toBe(false);
  });

  it('should return false if overlap only occurs at one point and buy is equal to sell', () => {
    const buy = {
      _sD_: '0',
      _eD_: '10',
      _sP_: '2',
      _eP_: '4',
    };
    const sell = {
      _sD_: '10',
      _eD_: '20',
      _sP_: '4',
      _eP_: '7',
    };
    expect(isReverseGradientOrders(buy, sell)).toBe(false);
  });

  // @todo(gradient)
  // it('should return true if buy line is above sell line in the middle of overlap', () => {
  //   const buy = {
  //     _sD_: '0',
  //     _eD_: '10',
  //     _sP_: '2',
  //     _eP_: '7',
  //   };
  //   const sell = {
  //     _sD_: '0',
  //     _eD_: '10',
  //     _sP_: '4',
  //     _eP_: '5',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  // it('should return true if lines cross', () => {
  //   const buy = {
  //     _sD_: '0',
  //     _eD_: '10',
  //     _sP_: '4',
  //     _eP_: '2',
  //   };
  //   const sell = {
  //     _sD_: '0',
  //     _eD_: '10',
  //     _sP_: '2',
  //     _eP_: '4',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  // it('should handle decimal values correctly', () => {
  //   const buy = {
  //     _sD_: '0',
  //     _eD_: '10',
  //     _sP_: '2.5',
  //     _eP_: '7.5',
  //   };
  //   const sell = {
  //     _sD_: '2',
  //     _eD_: '12',
  //     _sP_: '4.5',
  //     _eP_: '3.5',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  // it('should handle string number values correctly', () => {
  //   const buy = {
  //     _sD_: '0',
  //     _eD_: '10',
  //     _sP_: '2.5',
  //     _eP_: '7.5',
  //   };
  //   const sell = {
  //     _sD_: '2',
  //     _eD_: '12',
  //     _sP_: '4.5',
  //     _eP_: '3.5',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });
});
