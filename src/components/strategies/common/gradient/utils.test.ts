import { describe, expect, it } from 'vitest';
import { isReverseGradientOrders } from './utils';

describe('isReverseGradientOrders', () => {
  // @todo(gradient)
  // it('should return true if buy line is above sell line', () => {
  //   const buy = {
  //     startDate: '0',
  //     endDate: '10',
  //     startPrice: '2',
  //     endPrice: '8',
  //   };
  //   const sell = {
  //     startDate: '2',
  //     endDate: '12',
  //     startPrice: '5',
  //     endPrice: '3',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  it('should return false if buy line is below sell line', () => {
    const buy = {
      startDate: '0',
      endDate: '10',
      startPrice: '2',
      endPrice: '4',
    };
    const sell = {
      startDate: '2',
      endDate: '12',
      startPrice: '5',
      endPrice: '7',
    };
    expect(isReverseGradientOrders(buy, sell)).toBe(false);
  });

  it('should return false if lines do not overlap', () => {
    const buy = {
      startDate: '0',
      endDate: '10',
      startPrice: '2',
      endPrice: '4',
    };
    const sell = {
      startDate: '12',
      endDate: '20',
      startPrice: '5',
      endPrice: '7',
    };
    expect(isReverseGradientOrders(buy, sell)).toBe(false);
  });

  // @todo(gradient)
  // it('should return true if buy line slopes downwards and overlaps', () => {
  //   const buy = {
  //     startDate: '0',
  //     endDate: '10',
  //     startPrice: '8',
  //     endPrice: '2',
  //   };
  //   const sell = {
  //     startDate: '2',
  //     endDate: '12',
  //     startPrice: '5',
  //     endPrice: '7',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  it('should return false if overlap only occurs at one point and buy is not above sell', () => {
    const buy = {
      startDate: '0',
      endDate: '10',
      startPrice: '2',
      endPrice: '4',
    };
    const sell = {
      startDate: '10',
      endDate: '20',
      startPrice: '5',
      endPrice: '7',
    };
    expect(isReverseGradientOrders(buy, sell)).toBe(false);
  });

  it('should return false if overlap only occurs at one point and buy is equal to sell', () => {
    const buy = {
      startDate: '0',
      endDate: '10',
      startPrice: '2',
      endPrice: '4',
    };
    const sell = {
      startDate: '10',
      endDate: '20',
      startPrice: '4',
      endPrice: '7',
    };
    expect(isReverseGradientOrders(buy, sell)).toBe(false);
  });

  // @todo(gradient)
  // it('should return true if buy line is above sell line in the middle of overlap', () => {
  //   const buy = {
  //     startDate: '0',
  //     endDate: '10',
  //     startPrice: '2',
  //     endPrice: '7',
  //   };
  //   const sell = {
  //     startDate: '0',
  //     endDate: '10',
  //     startPrice: '4',
  //     endPrice: '5',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  // it('should return true if lines cross', () => {
  //   const buy = {
  //     startDate: '0',
  //     endDate: '10',
  //     startPrice: '4',
  //     endPrice: '2',
  //   };
  //   const sell = {
  //     startDate: '0',
  //     endDate: '10',
  //     startPrice: '2',
  //     endPrice: '4',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  // it('should handle decimal values correctly', () => {
  //   const buy = {
  //     startDate: '0',
  //     endDate: '10',
  //     startPrice: '2.5',
  //     endPrice: '7.5',
  //   };
  //   const sell = {
  //     startDate: '2',
  //     endDate: '12',
  //     startPrice: '4.5',
  //     endPrice: '3.5',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });

  // it('should handle string number values correctly', () => {
  //   const buy = {
  //     startDate: '0',
  //     endDate: '10',
  //     startPrice: '2.5',
  //     endPrice: '7.5',
  //   };
  //   const sell = {
  //     startDate: '2',
  //     endDate: '12',
  //     startPrice: '4.5',
  //     endPrice: '3.5',
  //   };
  //   expect(isReverseGradientOrders(buy, sell)).toBe(true);
  // });
});
