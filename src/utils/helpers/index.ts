import numbro from 'numbro';
import { TokenPair } from '@bancor/carbon-sdk';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Graphemer from 'graphemer';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { SafeDecimal } from '../../libs/safedecimal';
import { FiatSymbol } from 'utils/carbonApi';

export const isProduction = window
  ? window.location.host.includes('carbondefi.xyz')
  : true;

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
  const splitter = new Graphemer();
  const stringArray = splitter.splitGraphemes(string);

  if (stringArray.length <= toLength) {
    return string;
  }
  const startEndLength = Math.floor((toLength - separator.length) / 2);
  const start = stringArray.slice(0, startEndLength).join('');
  const end = stringArray
    .slice(stringArray.length - startEndLength, stringArray.length)
    .join('');
  return start + separator + end;
};

export const getFiatDisplayValue = (
  fiatValue: SafeDecimal | string | number,
  currentCurrency: FiatSymbol
) => {
  return prettifyNumber(fiatValue, { currentCurrency });
};

const prettifyNumberAbbreviateFormat: numbro.Format = {
  average: true,
  mantissa: 1,
  optionalMantissa: true,
  lowPrecision: false,
  spaceSeparated: true,
  roundingFunction: (num) => Math.floor(num),
};

const defaultNumbroOptions: numbro.Format = {
  roundingFunction: (num) => Math.floor(num),
  mantissa: 0,
  optionalMantissa: true,
  thousandSeparated: true,
  trimMantissa: true,
};

const getDefaultNumberoOptions = (round = false) => {
  return {
    ...defaultNumbroOptions,
    ...(round && {
      roundingFunction: (num: number) => Math.round(num),
    }),
  };
};

interface PrettifyNumberOptions {
  abbreviate?: boolean;
  currentCurrency?: FiatSymbol;
  highPrecision?: boolean;
  locale?: string;
  round?: boolean;
}

export function prettifyNumber(num: number | string | SafeDecimal): string;

export function prettifyNumber(
  num: number | string | SafeDecimal,
  options?: PrettifyNumberOptions
): string;

export function prettifyNumber(
  num: number | string | SafeDecimal,
  options?: PrettifyNumberOptions
): string {
  const {
    abbreviate = false,
    highPrecision = false,
    round = false,
  } = options || {};

  const bigNum = new SafeDecimal(num);
  if (options?.currentCurrency) {
    return handlePrettifyNumberCurrency(bigNum, options);
  }

  if (bigNum.lte(0)) return '0';
  if (bigNum.lt(0.000001)) return '< 0.000001';
  if (abbreviate && bigNum.gt(999999))
    return numbro(bigNum).format({
      ...prettifyNumberAbbreviateFormat,
      ...(round && {
        roundingFunction: (num) => Math.round(num),
      }),
    });
  if (!highPrecision) {
    if (bigNum.gte(1000))
      return numbro(bigNum).format(getDefaultNumberoOptions(round));
    if (bigNum.gte(2))
      return `${numbro(bigNum).format({
        ...getDefaultNumberoOptions(round),
        mantissa: 2,
      })}`;
  }
  return `${numbro(bigNum).format({
    ...getDefaultNumberoOptions(round),
    mantissa: 6,
  })}`;
}

const getDisplayCurrency = (currency: string) => {
  if (!Intl.supportedValuesOf) return 'symbol';
  if (Intl.supportedValuesOf('currency').includes(currency)) return 'symbol';
  return 'name';
};

const handlePrettifyNumberCurrency = (
  num: SafeDecimal,
  options?: PrettifyNumberOptions
) => {
  const {
    abbreviate = false,
    highPrecision = false,
    locale = 'en-US',
    currentCurrency = 'USD',
    round = false,
  } = options || {};

  const nfCurrencyOptionsDefault: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currentCurrency,
    currencyDisplay: getDisplayCurrency(currentCurrency),
    useGrouping: true,
    // @ts-ignore: TS52072 roundingMode is not yet supported in TypeScript 5.2
    roundingMode: round ? 'halfExpand' : 'floor',
  };

  if (num.lte(0))
    return Intl.NumberFormat(locale, nfCurrencyOptionsDefault)
      .format(0)
      .toString();
  if (num.lte(0.01))
    return (
      '< ' +
      Intl.NumberFormat(locale, {
        ...nfCurrencyOptionsDefault,
        minimumFractionDigits: 2,
      })
        .format(0.01)
        .toString()
    );
  if (abbreviate && num.gt(999999))
    return Intl.NumberFormat(locale, {
      ...nfCurrencyOptionsDefault,
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(num.toNumber());

  if (!highPrecision && num.gt(100)) {
    return Intl.NumberFormat(locale, {
      ...nfCurrencyOptionsDefault,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num.toNumber());
  }

  return Intl.NumberFormat(locale, nfCurrencyOptionsDefault).format(
    num.toNumber()
  );
};

export const wait = async (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const buildPairKey = (pair: TradePair) =>
  [
    pair.baseToken.address.toLowerCase(),
    pair.quoteToken.address.toLowerCase(),
  ].join('-');

export const buildTokenPairKey = (pair: TokenPair) =>
  pair.join('-').toLowerCase();

export const setIntervalUsingTimeout = (
  callback: Function,
  interval: number
): NodeJS.Timeout => {
  let intervalId: NodeJS.Timeout;

  const timeoutCallback = () => {
    callback();
    intervalId = setTimeout(timeoutCallback, interval);
  };

  intervalId = setTimeout(timeoutCallback, interval);
  return intervalId;
};

export const convertCase = (input: string, toSnakeCase: boolean): string => {
  if (toSnakeCase) {
    return input.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
  } else {
    return input.replace(/(_[a-z])/g, (match) =>
      match.toUpperCase().replace('_', '')
    );
  }
};

export const getLowestBits = (decimal: string, bits: number = 128): string => {
  const bigInt = BigInt(decimal);
  const binary = bigInt.toString(2);

  // Pad the binary string with zeroes to ensure it's 256 bits long
  const paddedBinary = binary.padStart(256, '0');
  const lowerBits = paddedBinary.substr(bits);

  const bigIntFromLowerBits = BigInt('0b' + lowerBits);

  return bigIntFromLowerBits.toString();
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const sortObjectArray = <D extends object>(
  array: D[],
  property: keyof D,
  customSort?: (a: D, b: D) => 1 | -1 | 0
): D[] => {
  return array.sort(
    customSort
      ? customSort
      : (a, b) => {
          if (a[property] > b[property]) {
            return 1;
          } else if (a[property] < b[property]) {
            return -1;
          }
          return 0;
        }
  );
};

export const isPathnameMatch = (
  currentPath: string,
  href: string,
  hrefMatches: string[]
) => {
  // Remove trailing /
  const current =
    currentPath !== '/' && currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath;
  if (current === href) return true;
  return hrefMatches
    .filter((x) => x !== '/')
    .some((x) => current.startsWith(x));
};

export const formatNumberWithApproximation = (
  num: SafeDecimal,
  { isPercentage = false, approximateBelow = 0.01 } = {}
): { value: string; negative: boolean } => {
  const addPercentage = (value: string) => (isPercentage ? value + '%' : value);

  if (num.isZero()) {
    return { value: addPercentage('0.00'), negative: false };
  } else if (num.gt(0) && num.lt(approximateBelow)) {
    return { value: addPercentage(`< ${approximateBelow}`), negative: false };
  } else if (num.gte(approximateBelow)) {
    return { value: addPercentage(num.toFixed(2)), negative: false };
  } else if (num.gt(-1 * approximateBelow)) {
    return { value: addPercentage(`> -${approximateBelow}`), negative: true };
  } else {
    return { value: addPercentage(num.toFixed(2)), negative: true };
  }
};
