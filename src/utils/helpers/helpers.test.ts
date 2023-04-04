import { prettifyNumber } from '.';
import { test, it, expect } from 'vitest';

test('prettifyNumber', () => {
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

  test('should return "1,321,965,595" for large number', () => {
    expect(prettifyNumber(1321965595)).toEqual('1,321,965,595');
  });

  test('should return "1,321,965,595" for large number and usd  true', () => {
    expect(prettifyNumber(1321965595, { usd: true })).toEqual('$1,321,965,595');
  });

  test('Check rounding is correct - default = math.floor', () => {
    expect(prettifyNumber(18999.999999999851769955)).toEqual('18,999');
    expect(prettifyNumber(19999.999999999986138278)).toEqual('19,999');
  });

  test('Check rounding is correct - math.round', () => {
    expect(prettifyNumber(18999.999999999851769955, { round: true })).toEqual(
      '19,000'
    );
    expect(prettifyNumber(19999.999999999986138278, { round: true })).toEqual(
      '20,000'
    );
  });

  test('Check rounding is correct - usd = true', () => {
    expect(prettifyNumber(18999.999999999851769955, { usd: true })).toEqual(
      '$18,999'
    );
    expect(
      prettifyNumber(19999.999999999986138278, { round: true, usd: true })
    ).toEqual('$20,000');
  });

  test('Remove redundant zero', () => {
    expect(prettifyNumber('18.00000')).toEqual('18');
    expect(prettifyNumber('18.120000')).toEqual('18.12');
    expect(prettifyNumber('18.12345678910000')).toEqual('18.12');
  });
});
