import { describe, test, expect } from 'vitest';
import { SafeDecimal } from 'libs/safedecimal';
import {
  formatNumber,
  prettifyNumber,
  sanitizeNumber,
  formatNumberWithApproximation,
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
    expect(formatNumber('.')).toBe('0');
    expect(formatNumber('.1')).toBe('0.1');
    expect(formatNumber('1.1010')).toBe('1.101');
    expect(formatNumber('01.100')).toBe('1.1');
  });
  describe('prettifyNumber', () => {
    test('should return 0 for input lower then 0', () => {
      expect(prettifyNumber(-5000)).toEqual('0');
    });
    describe('Currency', () => {
      test('should return $0.00 for input lower then 0 and currentCurrency is USD', () => {
        expect(prettifyNumber(-10, { currentCurrency: 'USD' })).toEqual(
          '$0.00'
        );
      });

      test('should return €0.00 for input lower then 0 and currentCurrency is EUR', () => {
        expect(prettifyNumber(-10, { currentCurrency: 'EUR' })).toEqual(
          '€0.00'
        );
      });

      test('should return 0.00 ETH for input lower then 0 and currentCurrency is ETH', () => {
        expect(prettifyNumber(-10, { currentCurrency: 'ETH' })).toEqual(
          '0.00 ETH'
        );
      });

      test('should return ¥0 for input lower then 0 and currentCurrency is JPY', () => {
        expect(prettifyNumber(-10, { currentCurrency: 'JPY' })).toEqual('¥0');
      });

      test('should return "$0.00" for input 0 and no currentCurrency selected', () => {
        expect(prettifyNumber(0)).toEqual('0');
      });

      test('should return "$0.00" for input 0 and currentCurrency is USD', () => {
        expect(prettifyNumber(0, { currentCurrency: 'USD' })).toEqual('$0.00');
      });

      test('should return "€0.00" for input 0 and currentCurrency is EUR', () => {
        expect(prettifyNumber(0, { currentCurrency: 'EUR' })).toEqual('€0.00');
      });

      test('should return "0.00 ETH" for input 0 and currentCurrency is ETH', () => {
        expect(prettifyNumber(0, { currentCurrency: 'ETH' })).toEqual(
          '0.00 ETH'
        );
      });

      test('should return "¥0" for input 0 and currentCurrency is JPY', () => {
        expect(prettifyNumber(0, { currentCurrency: 'JPY' })).toEqual('¥0');
      });

      test('should return "0" for input 0 and no currentCurrency selected', () => {
        expect(prettifyNumber(0, {})).toEqual('0');
      });

      test('should return "$0.001" for input 0.001 and currentCurrency is USD', () => {
        expect(prettifyNumber(0.001, { currentCurrency: 'USD' })).toEqual(
          '$0.001'
        );
      });

      test('should return "€0.001" for input 0.001 and currentCurrency is EUR', () => {
        expect(prettifyNumber(0.001, { currentCurrency: 'EUR' })).toEqual(
          '€0.001'
        );
      });

      test('should return "0.001 ETH" for input 0.001 and currentCurrency is ETH', () => {
        expect(prettifyNumber(0.001, { currentCurrency: 'ETH' })).toEqual(
          '0.001 ETH'
        );
      });

      test('should return "0.0₃1 ETH" for input 0.0001 and currentCurrency is ETH', () => {
        expect(prettifyNumber(0.0001, { currentCurrency: 'ETH' })).toEqual(
          '0.0₃1 ETH'
        );
      });

      test('should return "0.0₄1 ETH" for input 0.00001 and currentCurrency is ETH', () => {
        expect(prettifyNumber(0.00001, { currentCurrency: 'ETH' })).toEqual(
          '0.0₄1 ETH'
        );
      });

      test('should return "¥0.001" for input 0.001 and currentCurrency is JPY', () => {
        expect(prettifyNumber(0.001, { currentCurrency: 'JPY' })).toEqual(
          '¥0.001'
        );
      });

      test('should return "1,000" for input 1000 and no currentCurrency selected', () => {
        expect(prettifyNumber(1000, {})).toEqual('1,000');
      });

      test('should return "$1.23" for input 1.2345 and currentCurrency is USD', () => {
        expect(prettifyNumber(1.2345, { currentCurrency: 'USD' })).toEqual(
          '$1.23'
        );
      });

      test('should return "€1.23" for input 1.2345 and currentCurrency is EUR', () => {
        expect(prettifyNumber(1.2345, { currentCurrency: 'EUR' })).toEqual(
          '€1.23'
        );
      });

      test('should return "1.23 ETH" for input 1.2345 and currentCurrency is ETH', () => {
        expect(prettifyNumber(1.2345, { currentCurrency: 'ETH' })).toEqual(
          '1.23 ETH'
        );
      });

      test('should return "¥1" for input 1.2345 and currentCurrency is JPY', () => {
        expect(prettifyNumber(1.2345, { currentCurrency: 'JPY' })).toEqual(
          '¥1'
        );
      });

      test('should return "$123,456,789" for input 123456789 and currentCurrency is USD', () => {
        expect(prettifyNumber(123456789, { currentCurrency: 'USD' })).toEqual(
          '$123,456,789'
        );
      });

      test('should return "€123,456,789" for input 123456789 and currentCurrency is EUR', () => {
        expect(prettifyNumber(123456789, { currentCurrency: 'EUR' })).toEqual(
          '€123,456,789'
        );
      });

      test('should return "123,456,789 ETH" for input 123456789 and currentCurrency is ETH', () => {
        expect(prettifyNumber(123456789, { currentCurrency: 'ETH' })).toEqual(
          '123,456,789 ETH'
        );
      });

      test('should return "¥123,456,789" for input 123456789 and currentCurrency is JPY', () => {
        expect(prettifyNumber(123456789, { currentCurrency: 'JPY' })).toEqual(
          '¥123,456,789'
        );
      });

      test('should return "$1.2M" for input 1234567, with abbreviate true, and currentCurrency is USD', () => {
        expect(
          prettifyNumber(1234567, { abbreviate: true, currentCurrency: 'USD' })
        ).toEqual('$1.2M');
      });

      test('should return "1.2M ETH" for input 1234567, with abbreviate true, and currentCurrency is ETH', () => {
        expect(
          prettifyNumber(1234567, { abbreviate: true, currentCurrency: 'ETH' })
        ).toEqual('1.2M ETH');
      });

      test('should return "¥1.2M" for input 1234567, with abbreviate true, and currentCurrency is JPY', () => {
        expect(
          prettifyNumber(1234567, { abbreviate: true, currentCurrency: 'JPY' })
        ).toEqual('¥1.2M');
      });
    });

    describe('Numbers', () => {
      test('should return "1.2M" for input 1234567 and no currentCurrency selected', () => {
        expect(prettifyNumber(1234567, { abbreviate: true })).toEqual('1.2 m');
      });

      test('should return "1.234567" for input 1.23456789 and no currentCurrency selected', () => {
        expect(prettifyNumber(1.23456789, { highPrecision: true })).toEqual(
          '1.234567'
        );
      });

      test('should return "0.0₅1" for input 0.000001 and no currentCurrency selected', () => {
        expect(prettifyNumber(0.000001)).toEqual('0.0₅1');
      });

      test('should return "0.0₆12345" for input 0.000000123456 and no currentCurrency selected', () => {
        expect(prettifyNumber(0.000000123456)).toEqual('0.0₆12345');
      });

      test('should return "1,321,965,595" for large number', () => {
        expect(prettifyNumber(1321965595)).toEqual('1,321,965,595');
      });

      test('should return "$1,321,965,595" for large number and currentCurrency is USD', () => {
        expect(prettifyNumber(1321965595, { currentCurrency: 'USD' })).toEqual(
          '$1,321,965,595'
        );
      });

      test('Check rounding is correct - default = math.floor', () => {
        expect(prettifyNumber(18999.999999999851769955)).toEqual('18,999');
        expect(prettifyNumber(19999.999999999986138278)).toEqual('19,999');
      });

      test('Check rounding is correct - math.round', () => {
        expect(
          prettifyNumber(18999.999999999851769955, { round: true })
        ).toEqual('19,000');
        expect(
          prettifyNumber(19999.999999999986138278, { round: true })
        ).toEqual('20,000');
      });

      test('Check rounding is correct - currentCurrency is USD', () => {
        expect(
          prettifyNumber(18999.999999999851769955, { currentCurrency: 'USD' })
        ).toEqual('$18,999');
        expect(
          prettifyNumber(19999.999999999986138278, {
            round: true,
            currentCurrency: 'USD',
          })
        ).toEqual('$20,000');
      });

      test('Remove redundant zero', () => {
        expect(prettifyNumber('18.00000')).toEqual('18');
        expect(prettifyNumber('18.120000')).toEqual('18.12');
        expect(prettifyNumber('18.12345678910000')).toEqual('18.12');
      });
    });
  });

  describe('formatNumberWithApproximation', () => {
    const testCases: [
      SafeDecimal,
      { isPercentage?: boolean; approximateBelow?: number },
      { value: string; negative: boolean }
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
});
