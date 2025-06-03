/* eslint-disable no-loss-of-precision */
import { describe, test, expect } from 'vitest';
import { SafeDecimal } from 'libs/safedecimal';
import {
  formatNumber,
  prettifyNumber,
  sanitizeNumber,
  formatNumberWithApproximation,
  roundSearchParam,
} from './number';

describe('Test helpers', () => {
  test('sanitizeNumber', () => {
    expect(sanitizeNumber('abcdefghijklmnopqrstuvwxyz')).toBe('');
    expect(sanitizeNumber('&"\'(-_)=²~#{[|`\\^@]}¨£%µ?/§¤')).toBe('');
    expect(sanitizeNumber('👋')).toBe('');
    expect(sanitizeNumber('.')).toBe('.');
    expect(sanitizeNumber('.1')).toBe('.1');
    expect(sanitizeNumber('1.')).toBe('1.');
    expect(sanitizeNumber('1..1')).toBe('1.1');
    expect(sanitizeNumber('1.10.12')).toBe('1.1012');
    expect(sanitizeNumber('1,1')).toBe('1.1');
    expect(sanitizeNumber('10')).toBe('10');
    expect(sanitizeNumber('01.10')).toBe('01.10');
    expect(sanitizeNumber('0.1000000', 3)).toBe('0.100');
  });
  test('formatNumber', () => {
    expect(formatNumber('')).toBe('');
    expect(formatNumber('.')).toBe('0');
    expect(formatNumber('0.0000000')).toBe('0');
    expect(formatNumber('.1')).toBe('0.1');
    expect(formatNumber('1.1010')).toBe('1.101');
    expect(formatNumber('01.100')).toBe('1.1');
    expect(formatNumber('01.00')).toBe('1');
    expect(formatNumber('1.000000000100')).toBe('1.0000000001');
    expect(formatNumber('.000000000100')).toBe('0.0000000001');
  });
  describe('prettifyNumber', () => {
    test('should return 0 for input lower then 0', () => {
      expect(prettifyNumber(-5000)).toEqual('0.00');
    });
    describe('Currency', () => {
      test('should return $0.00 for input lower then 0 and currentCurrency is USD', () => {
        expect(prettifyNumber(-10, { currentCurrency: 'USD' })).toEqual(
          '$0.00',
        );
      });

      test('should return €0.00 for input lower then 0 and currentCurrency is EUR', () => {
        expect(prettifyNumber(-10, { currentCurrency: 'EUR' })).toEqual(
          '€0.00',
        );
      });

      test('should return 0.00 ETH for input lower then 0 and currentCurrency is ETH', () => {
        expect(prettifyNumber(-10, { currentCurrency: 'ETH' })).toEqual(
          '0.00 ETH',
        );
      });

      test('should return ¥0.00 for input lower then 0 and currentCurrency is JPY', () => {
        expect(prettifyNumber(-10, { currentCurrency: 'JPY' })).toEqual(
          '¥0.00',
        );
      });

      test('should return "$0.00" for input 0 and currentCurrency is USD', () => {
        expect(prettifyNumber(0, { currentCurrency: 'USD' })).toEqual('$0.00');
      });

      test('should return "€0.00" for input 0 and currentCurrency is EUR', () => {
        expect(prettifyNumber(0, { currentCurrency: 'EUR' })).toEqual('€0.00');
      });

      test('should return "0.00 ETH" for input 0 and currentCurrency is ETH', () => {
        expect(prettifyNumber(0, { currentCurrency: 'ETH' })).toEqual(
          '0.00 ETH',
        );
      });

      test('should return "¥0.00" for input 0 and currentCurrency is JPY', () => {
        expect(prettifyNumber(0, { currentCurrency: 'JPY' })).toEqual('¥0.00');
      });

      // < 1
      test('should return "$0.001" for input 0.001 and currentCurrency is USD', () => {
        expect(prettifyNumber(0.001, { currentCurrency: 'USD' })).toEqual(
          '$0.001',
        );
      });

      test('should return "€0.001" for input 0.001 and currentCurrency is EUR', () => {
        expect(prettifyNumber(0.001, { currentCurrency: 'EUR' })).toEqual(
          '€0.001',
        );
      });

      test('should return "0.001 ETH" for input 0.001 and currentCurrency is ETH', () => {
        expect(prettifyNumber(0.001, { currentCurrency: 'ETH' })).toEqual(
          '0.001 ETH',
        );
      });

      test('should return "0.0₃1 ETH" for input 0.0001 and currentCurrency is ETH', () => {
        expect(prettifyNumber(0.0001, { currentCurrency: 'ETH' })).toEqual(
          '0.0₃1 ETH',
        );
      });

      test('should return "0.0₄1 ETH" for input 0.00001 and currentCurrency is ETH', () => {
        expect(prettifyNumber(0.00001, { currentCurrency: 'ETH' })).toEqual(
          '0.0₄1 ETH',
        );
      });

      test('should return "¥0.001" for input 0.001 and currentCurrency is JPY', () => {
        expect(prettifyNumber(0.001, { currentCurrency: 'JPY' })).toEqual(
          '¥0.001',
        );
      });

      // 1 -> 10
      test('should return "$1.2345" for input 1.23456 and currentCurrency is USD', () => {
        expect(prettifyNumber(1.2345, { currentCurrency: 'USD' })).toEqual(
          '$1.2345',
        );
      });

      test('should return "€1.2346" for input 1.23456 and currentCurrency is EUR', () => {
        expect(prettifyNumber(1.2345, { currentCurrency: 'EUR' })).toEqual(
          '€1.2345',
        );
      });

      test('should return "1.23 ETH" for input 1.23456 and currentCurrency is ETH', () => {
        expect(prettifyNumber(1.2345, { currentCurrency: 'ETH' })).toEqual(
          '1.2345 ETH',
        );
      });

      test('should return "¥1.23" for input 1.23456 and currentCurrency is JPY', () => {
        expect(prettifyNumber(1.2345, { currentCurrency: 'JPY' })).toEqual(
          '¥1.2345',
        );
      });

      // > 10
      test('should return "$1,321,965,595.00" for large number and currentCurrency is USD', () => {
        expect(prettifyNumber(1321965595, { currentCurrency: 'USD' })).toEqual(
          '$1,321,965,595.00',
        );
      });

      test('should return "$123,456,789.00" for input 123456789 and currentCurrency is USD', () => {
        expect(prettifyNumber(123456789, { currentCurrency: 'USD' })).toEqual(
          '$123,456,789.00',
        );
      });

      test('should return "€123,456,789.00" for input 123456789 and currentCurrency is EUR', () => {
        expect(prettifyNumber(123456789, { currentCurrency: 'EUR' })).toEqual(
          '€123,456,789.00',
        );
      });

      test('should return "123,456,789.00 ETH" for input 123456789 and currentCurrency is ETH', () => {
        expect(prettifyNumber(123456789, { currentCurrency: 'ETH' })).toEqual(
          '123,456,789.00 ETH',
        );
      });

      test('should return "¥123,456,789.00" for input 123456789 and currentCurrency is JPY', () => {
        expect(prettifyNumber(123456789, { currentCurrency: 'JPY' })).toEqual(
          '¥123,456,789.00',
        );
      });

      test('should return "1,000" for input 1000 and no currentCurrency selected', () => {
        expect(prettifyNumber(1000, {})).toEqual('1,000.00');
      });

      ////////////////
      // Abbreviate //
      ////////////////
      test('should return "$1.23M" for input 1234567, with abbreviate true, and currentCurrency is USD', () => {
        expect(
          prettifyNumber(1234567, { abbreviate: true, currentCurrency: 'USD' }),
        ).toEqual('$1.23M');
      });

      test('should return "1.23M ETH" for input 1234567, with abbreviate true, and currentCurrency is ETH', () => {
        expect(
          prettifyNumber(1234567, { abbreviate: true, currentCurrency: 'ETH' }),
        ).toEqual('1.23M ETH');
      });

      test('should return "¥1.23M" for input 1234567, with abbreviate true, and currentCurrency is JPY', () => {
        expect(
          prettifyNumber(1234567, { abbreviate: true, currentCurrency: 'JPY' }),
        ).toEqual('¥1.23M');
      });

      ////////////////////
      // High Precision //
      ////////////////////
      test('should return "$12.34567" for input 1234567, with highPrecision, and currentCurrency is USD', () => {
        const option = { highPrecision: true, currentCurrency: 'USD' } as const;
        expect(prettifyNumber(12.34567, option)).toEqual('$12.34567');
      });

      test('should return "123,456.789 ETH" for input 123456.789, with highPrecision, and currentCurrency is ETH', () => {
        const option = { highPrecision: true, currentCurrency: 'ETH' } as const;
        expect(prettifyNumber(123456.789, option)).toEqual('123,456.789 ETH');
      });

      test('should return "¥1.234567" for input 1.23456789, with highPrecision, and currentCurrency is JPY', () => {
        const option = { highPrecision: true, currentCurrency: 'JPY' } as const;
        expect(prettifyNumber(1.23456789, option)).toEqual('¥1.234567');
      });
      test('should display 5 significant numbers when there is at least 6 zeros in a row', () => {
        const option = { highPrecision: true, currentCurrency: 'JPY' } as const;
        expect(prettifyNumber(0.000000123456789, option)).toEqual(
          '¥0.00000012345',
        );
      });
    });

    describe('Numbers', () => {
      // 0
      test('should return "0.00" for input 0 and no currentCurrency selected', () => {
        expect(prettifyNumber(0)).toEqual('0.00');
      });

      // 1 -> 10
      test('should return "1.0001" for input 1.00012', () => {
        expect(prettifyNumber(1.00012)).toEqual('1.0001');
      });
      test('should return "1.00" for input 1.00001', () => {
        expect(prettifyNumber(1.00001)).toEqual('1.00');
      });
      test('should return "6.5432" for input 6.54321', () => {
        expect(prettifyNumber(6.54321)).toEqual('6.5432');
      });

      // > 10
      test('should return "1,321,965,595.00" for large number', () => {
        expect(prettifyNumber(1321965595)).toEqual('1,321,965,595.00');
      });

      test('should return "1,321,965,595.00" for large number', () => {
        expect(prettifyNumber(1321965595)).toEqual('1,321,965,595.00');
      });

      test('Check rounding is correct - default = math.floor', () => {
        expect(prettifyNumber(18999.999999999851769955)).toEqual('18,999.99');
        expect(prettifyNumber(19999.999999999986138278)).toEqual('19,999.99');
      });

      test('Check rounding is correct - option.round', () => {
        expect(
          prettifyNumber(18999.999999999851769955, { round: true }),
        ).toEqual('19,000.00');
        expect(
          prettifyNumber(19999.999999999986138278, { round: true }),
        ).toEqual('20,000.00');
      });
      test('Check trunc is correct - option.isInteger', () => {
        expect(
          prettifyNumber(18999.999999999851769955, { isInteger: true }),
        ).toEqual('18,999');
        expect(prettifyNumber(0, { isInteger: true })).toEqual('0');
      });

      test('Check rounding is correct - currentCurrency is USD', () => {
        expect(
          prettifyNumber(18999.999999999851769955, { currentCurrency: 'USD' }),
        ).toEqual('$18,999.99');
        expect(
          prettifyNumber(19999.999999999986138278, {
            round: true,
            currentCurrency: 'USD',
          }),
        ).toEqual('$20,000.00');
      });

      test('Remove redundant zero', () => {
        expect(prettifyNumber('18.00000')).toEqual('18.00');
        expect(prettifyNumber('18.120000')).toEqual('18.12');
        expect(prettifyNumber('18.12345678910000')).toEqual('18.12');
      });

      ///////////////
      // Subscript //
      ///////////////
      test('should return "0.0₅1" for input 0.000001 and no currentCurrency selected', () => {
        expect(prettifyNumber(0.000001)).toEqual('0.0₅1');
      });

      test('should return "0.0₆12345" for input 0.000000123456 and no currentCurrency selected', () => {
        expect(prettifyNumber(0.000000123456)).toEqual('0.0₆12345');
      });

      ////////////////
      // Abbreviate //
      ////////////////
      test('Abbreviate should not display K for thousands', () => {
        expect(prettifyNumber(123456, { abbreviate: true })).toEqual(
          '123,456.00',
        );
      });
      test('Abbreviate should display M for millions', () => {
        expect(prettifyNumber(1234567, { abbreviate: true })).toEqual('1.23M');
      });
      test('Abbreviate should display B for billions', () => {
        expect(prettifyNumber(1234567890, { abbreviate: true })).toEqual(
          '1.23B',
        );
      });
      test('Abbreviate should display T for trillions', () => {
        expect(prettifyNumber(1234567890000, { abbreviate: true })).toEqual(
          '1.23T',
        );
      });

      ////////////////////
      // High Precision //
      ////////////////////
      test('High precision should trunc after 6 decimal by default', () => {
        const option = { highPrecision: true };
        expect(prettifyNumber(1.23456789, option)).toEqual('1.234567');
        expect(prettifyNumber(1.00000012, option)).toEqual('1.00');
      });
      test('High precision should trunc with decimals in options', () => {
        const option = { highPrecision: true, decimals: 10 };
        expect(prettifyNumber(1.2345678901234, option)).toEqual('1.2345678901');
      });
      test('High precision should has 5 significant digits if there is 6 zeros', () => {
        const option = { highPrecision: true };
        expect(prettifyNumber(0.0000001234567, option)).toEqual(
          '0.00000012345',
        );
        expect(prettifyNumber(0.000000000001234567, option)).toEqual(
          '0.0000000000012345',
        );
      });
      test('High precision should has 5 significant digits if decimals is 4 & there is at least 4 zeros', () => {
        const option = { highPrecision: true, decimals: 4 };
        expect(prettifyNumber(0.00001234567, option)).toEqual('0.000012345');
        expect(prettifyNumber(0.0000001234567, option)).toEqual(
          '0.00000012345',
        );
      });

      // Very large numbers
      test('should return "100.00e+18" for input 1e20', () => {
        expect(prettifyNumber(1e20)).toEqual('100.00e+18');
      });

      // Infinity
      test('should return "∞" for Infinity', () => {
        expect(prettifyNumber(Infinity)).toEqual('∞');
        expect(prettifyNumber('Infinity')).toEqual('∞');
      });
    });
  });

  describe('formatNumberWithApproximation', () => {
    const testCases: [
      SafeDecimal,
      { isPercentage?: boolean; approximateBelow?: number },
      { value: string; negative: boolean },
    ][] = [
      [new SafeDecimal(0), {}, { value: '0.00', negative: false }],
      [
        new SafeDecimal(0),
        { isPercentage: true },
        { value: '0.00%', negative: false },
      ],
      [
        new SafeDecimal(0.005),
        { approximateBelow: 0.2, isPercentage: true },
        { value: '< 0.2%', negative: false },
      ],
      [
        new SafeDecimal(0.01),
        { approximateBelow: 0.01 },
        { value: '0.01', negative: false },
      ],
      [
        new SafeDecimal(54.321),
        { approximateBelow: 0.01 },
        { value: '54.32', negative: false },
      ],
      [
        new SafeDecimal(23.456),
        { approximateBelow: 0.01 },
        { value: '23.46', negative: false },
      ],
      [
        new SafeDecimal(-0.005),
        { approximateBelow: 0.01 },
        { value: '> -0.01', negative: true },
      ],
      [
        new SafeDecimal(-0.01),
        { approximateBelow: 0.01, isPercentage: true },
        { value: '-0.01%', negative: true },
      ],
      [
        new SafeDecimal(-0.02),
        { approximateBelow: 0.01 },
        { value: '-0.02', negative: true },
      ],
      [
        new SafeDecimal(-34.567),
        { approximateBelow: 0.01 },
        { value: '-34.57', negative: true },
      ],
    ];

    testCases.forEach(([num, options, expected]) => {
      const percentageInfo = options.isPercentage ? ' with percentage' : '';
      const approximationInfo = options.approximateBelow
        ? ` and approximation below ${options.approximateBelow}`
        : '';
      const description = `Formats ${num.toString()}${percentageInfo}${approximationInfo} as ${
        expected.value
      }, negative: ${expected.negative}`;

      test(description, () => {
        const result = formatNumberWithApproximation(num, options);
        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe('roundSearchParam', () => {
    test('Should return empty string if value is 0-ish', () => {
      expect(roundSearchParam('')).toBe('');
      expect(roundSearchParam('.')).toBe('');
      expect(roundSearchParam('0')).toBe('');
      expect(roundSearchParam('0.0')).toBe('');
    });
    test('If inputValue >= 1, apply 6 decimal accuracy', () => {
      expect(roundSearchParam('12345.12345678901234567890')).toBe(
        '12345.123456',
      );
      expect(roundSearchParam('123.12345678901234567890')).toBe('123.123456');
      expect(roundSearchParam('1.12345678901234567890')).toBe('1.123456');
      expect(roundSearchParam('1.000000123456789')).toBe('1');
    });
    test('Should display maximum 6 decimals after leading 0 & remove trailing 0', () => {
      expect(roundSearchParam('0.12345678')).toBe('0.123456');
      expect(roundSearchParam('0.0001234567890')).toBe('0.000123456');
      expect(roundSearchParam('0.000000012345600001')).toBe('0.0000000123456');
      expect(roundSearchParam('0.100000012345678901234567890')).toBe('0.1');
    });
    test('Should remove scientific number price', () => {
      expect(roundSearchParam('1.1e-6')).toBe('0.0000011');
    });
  });
});
