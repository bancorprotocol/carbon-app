import BigNumber from 'bignumber.js';
import { prettifyNumber } from './helpers';

describe('prettifyNumber', () => {
  it('should return 0 for input lower then 0', () => {
    expect(prettifyNumber(-5000)).toEqual('0');
  });

  it('should return $0.00 for input lower then 0 and usd true', () => {
    expect(prettifyNumber(-10, true)).toEqual('$0.00');
  });

  it('should return "$0.00" for input 0 and optionsOrUsd undefined', () => {
    expect(prettifyNumber(0)).toEqual('0');
  });

  it('should return "$0.00" for input 0 and usd true', () => {
    expect(prettifyNumber(0, true)).toEqual('$0.00');
  });

  it('should return "0" for input 0 and optionsOrUsd false', () => {
    expect(prettifyNumber(0, false)).toEqual('0');
  });

  it('should return "100" for input 1000 and optionsOrUsd false', () => {
    expect(prettifyNumber(1000, false)).toEqual('1,000');
  });

  it('should return "$1.23" for input 1.2345 and optionsOrUsd true', () => {
    expect(prettifyNumber(1.2345, { usd: true })).toEqual('$1.23');
  });

  it('should return "< $0.01" for input 0.001 and optionsOrUsd true', () => {
    expect(prettifyNumber(0.001, { usd: true })).toEqual('< $0.01');
  });

  it('should return "1.2M" for input 1234567 and optionsOrUsd false', () => {
    expect(prettifyNumber(1234567, { abbreviate: true })).toEqual('1.2 m');
  });

  it('should return "1.234567" for input 1.23456789 and optionsOrUsd false', () => {
    expect(prettifyNumber(1.23456789, { highPrecision: true })).toEqual(
      '1.234567'
    );
  });

  it('should return "< 0.000001" for input 0.0000001 and optionsOrUsd false', () => {
    expect(prettifyNumber(0.0000001)).toEqual('< 0.000001');
  });

  test('should return "1.000000" for 1e-6 and supportExponential option', () => {
    expect(
      prettifyNumber(new BigNumber(1321965484984894959595), {
        supportExponential: true,
      })
    ).toEqual('1.321965484984895e+21');
  });
});
