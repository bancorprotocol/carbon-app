import { prettifyNumber, formatNumberWithApproximation } from '.';
import { describe, it, expect } from 'vitest';
import BigNumber from 'bignumber.js';

describe('prettifyNumber', () => {
  it('should return 0 for input lower then 0', () => {
    expect(prettifyNumber(-5000)).toEqual('0');
  });

  it('should return $0.00 for input lower then 0 and usd true', () => {
    expect(prettifyNumber(-10, { usd: true })).toEqual('$0.00');
  });

  it('should return "$0.00" for input 0 and optionsOrUsd undefined', () => {
    expect(prettifyNumber(0)).toEqual('0');
  });

  it('should return "$0.00" for input 0 and usd true', () => {
    expect(prettifyNumber(0, { usd: true })).toEqual('$0.00');
  });

  it('should return "0" for input 0 and usd false', () => {
    expect(prettifyNumber(0, { usd: false })).toEqual('0');
  });

  it('should return "100" for input 1000 and usd false', () => {
    expect(prettifyNumber(1000, { usd: false })).toEqual('1,000');
  });

  it('should return "$1.23" for input 1.2345 and usd true', () => {
    expect(prettifyNumber(1.2345, { usd: true })).toEqual('$1.23');
  });

  it('should return "< $0.01" for input 0.001 and usd true', () => {
    expect(prettifyNumber(0.001, { usd: true })).toEqual('< $0.01');
  });

  it('should return "1.2M" for input 1234567 and optionsOrUsd false', () => {
    expect(prettifyNumber(1234567, { abbreviate: true })).toEqual('1.2 m');
  });

  it('should return "1.234567" for input 1.23456789 and usd false', () => {
    expect(prettifyNumber(1.23456789, { highPrecision: true })).toEqual(
      '1.234567'
    );
  });

  it('should return "< 0.000001" for input 0.0000001 and optionsOrUsd false', () => {
    expect(prettifyNumber(0.0000001)).toEqual('< 0.000001');
  });

  it('should return "1,321,965,595" for large number', () => {
    expect(prettifyNumber(1321965595)).toEqual('1,321,965,595');
  });

  it('should return "1,321,965,595" for large number and usd  true', () => {
    expect(prettifyNumber(1321965595, { usd: true })).toEqual('$1,321,965,595');
  });

  it('Check rounding is correct - default = math.floor', () => {
    expect(prettifyNumber(18999.999999999851769955)).toEqual('18,999');
    expect(prettifyNumber(19999.999999999986138278)).toEqual('19,999');
  });

  it('Check rounding is correct - math.round', () => {
    expect(prettifyNumber(18999.999999999851769955, { round: true })).toEqual(
      '19,000'
    );
    expect(prettifyNumber(19999.999999999986138278, { round: true })).toEqual(
      '20,000'
    );
  });

  it('Check rounding is correct - usd = true', () => {
    expect(prettifyNumber(18999.999999999851769955, { usd: true })).toEqual(
      '$18,999'
    );
    expect(
      prettifyNumber(19999.999999999986138278, { round: true, usd: true })
    ).toEqual('$20,000');
  });

  it('Remove redundant zero', () => {
    expect(prettifyNumber('18.00000')).toEqual('18');
    expect(prettifyNumber('18.120000')).toEqual('18.12');
    expect(prettifyNumber('18.12345678910000')).toEqual('18.12');
  });
});

describe('formatNumberWithApproximation', () => {
  const testCases: [
    BigNumber,
    { isPercentage?: boolean; approximateBelow?: number },
    { value: string; negative: boolean }
  ][] = [
    [new BigNumber(0), {}, { value: '0.00', negative: false }],
    [
      new BigNumber(0),
      { isPercentage: true },
      { value: '0.00%', negative: false },
    ],
    [
      new BigNumber(0.005),
      { approximateBelow: 0.2, isPercentage: true },
      { value: '< 0.2%', negative: false },
    ],
    [
      new BigNumber(0.01),
      { approximateBelow: 0.01 },
      { value: '0.01', negative: false },
    ],
    [
      new BigNumber(54.321),
      { approximateBelow: 0.01 },
      { value: '54.32', negative: false },
    ],
    [
      new BigNumber(23.456),
      { approximateBelow: 0.01 },
      { value: '23.46', negative: false },
    ],
    [
      new BigNumber(-0.005),
      { approximateBelow: 0.01 },
      { value: '> -0.01', negative: true },
    ],
    [
      new BigNumber(-0.01),
      { approximateBelow: 0.01, isPercentage: true },
      { value: '-0.01%', negative: true },
    ],
    [
      new BigNumber(-0.02),
      { approximateBelow: 0.01 },
      { value: '-0.02', negative: true },
    ],
    [
      new BigNumber(-34.567),
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

    it(description, () => {
      const result = formatNumberWithApproximation(num, options);
      expect(result).to.deep.equal(expected);
    });
  });
});
