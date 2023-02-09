import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import numbro from 'numbro';
import { config } from 'services/web3/config';

export const isProduction = window.location.host.includes('bancor.network');

export const uuid = () => {
  return 'xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const sanitizeNumberInput = (
  input: string,
  precision?: number
): string => {
  const sanitized = input
    .replace(/,/, '.')
    .replace(/[^\d.]/g, '')
    .replace(/\./, 'x')
    .replace(/\./g, '')
    .replace(/x/, '.');
  if (!precision) return sanitized;
  const [integer, decimals] = sanitized.split('.');
  if (decimals) return `${integer}.${decimals.substring(0, precision)}`;
  else return sanitized;
};

export const shortenString = (
  string: string,
  separator = '...',
  toLength = 13
): string => {
  if (string.length <= toLength) {
    return string;
  }
  const startEndLength = Math.floor((toLength - separator.length) / 2);
  const start = string.substring(0, startEndLength);
  const end = string.substring(string.length - startEndLength, string.length);
  return start + separator + end;
};

export const reduceETH = (value: string, address: string) => {
  if (address === config.tokens.ETH)
    return new BigNumber(value).minus(0.01).toString();

  return value;
};

const prettifyNumberAbbreviateFormat: numbro.Format = {
  average: true,
  mantissa: 1,
  optionalMantissa: true,
  lowPrecision: false,
  spaceSeparated: true,
  roundingFunction: (num) => Math.floor(num),
};

export function prettifyNumber(num: number | string | BigNumber): string;

export function prettifyNumber(
  num: number | string | BigNumber,
  usd: boolean
): string;

export function prettifyNumber(
  num: number | string | BigNumber,
  options?: { usd?: boolean; abbreviate?: boolean; highPrecision?: boolean }
): string;

export function prettifyNumber(
  num: number | string | BigNumber,
  optionsOrUsd?:
    | { usd?: boolean; abbreviate?: boolean; highPrecision?: boolean }
    | boolean
): string {
  let usd, abbreviate, highPrecision;
  if (optionsOrUsd === undefined) {
    usd = false;
    abbreviate = false;
  } else if (typeof optionsOrUsd === 'boolean') {
    usd = optionsOrUsd;
    abbreviate = false;
  } else {
    usd = optionsOrUsd.usd;
    abbreviate = optionsOrUsd.abbreviate;
    highPrecision = optionsOrUsd.highPrecision;
  }

  const bigNum = new BigNumber(num);
  if (usd) {
    if (bigNum.lte(0)) return '$0.00';
    if (bigNum.lt(0.01)) return '< $0.01';
    if (!highPrecision) {
      if (bigNum.gt(100)) return numeral(bigNum).format('$0,0', Math.floor);
    }
    if (abbreviate && bigNum.gt(999999))
      return `$${numbro(bigNum).format(prettifyNumberAbbreviateFormat)}`;
    return numeral(bigNum).format('$0,0.00', Math.floor);
  }

  if (bigNum.lte(0)) return '0';
  if (abbreviate && bigNum.gt(999999))
    return numbro(bigNum).format(prettifyNumberAbbreviateFormat);
  if (!highPrecision) {
    if (bigNum.gte(1000)) return numeral(bigNum).format('0,0', Math.floor);
    if (bigNum.gte(2)) return numeral(bigNum).format('0,0.[00]', Math.floor);
  }
  if (bigNum.lt(0.000001)) return '< 0.000001';
  return numeral(bigNum).format('0,0.[000000]', Math.floor);
}

export const wait = async (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};
