import type { FiatSymbol } from 'utils/carbonApi';
import { SafeDecimal } from 'libs/safedecimal';
import numbro from 'numbro';

export const getFiatDisplayValue = (
  fiatValue: SafeDecimal | string | number,
  currentCurrency: FiatSymbol
) => {
  return prettifyNumber(fiatValue, { currentCurrency });
};

/** Enforce precision on a string number */
export const sanitizeNumber = (input: string, precision?: number): string => {
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

/** Format string number to look like a real number */
export const formatNumber = (value: string) => {
  if (!value || value === '.') return '0';
  return new SafeDecimal(value).toString();
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

const subscriptMap: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};

const subscriptCharacters = (amount: number | string) => {
  return amount
    .toString()
    .split('')
    .map((v) => subscriptMap[v])
    .join('');
};

const subscript = (value: string) => {
  if (value.includes('e-')) {
    const [base, amount] = value.split('e-');
    const trailing = base.replace('.', '').slice(0, 5);
    const htmlCharacters = subscriptCharacters(Number(amount) - 1);
    return `0.0${htmlCharacters}${trailing}`;
  } else {
    // Get consecutive zeros after the decimal point
    const match = value.match(/\.0+/);
    if (!match) return value;
    const amount = match ? match[0].length - 1 : 0;
    const trailing = value.substring(amount + 2, amount + 7);
    const htmlCharacters = subscriptCharacters(amount);
    return `0.0${htmlCharacters}${trailing}`;
  }
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
  if (bigNum.lt(0.001)) {
    return subscript(bigNum.toString());
  }
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
  // @ts-ignore: TS52072 supportedValuesOf is not yet supported in TypeScript 5.2
  if (!Intl.supportedValuesOf) return 'symbol';
  // @ts-ignore: TS52072 supportedValuesOf is not yet supported in TypeScript 5.2
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
  if (num.lt(0.001)) {
    // Use number format with 0 and replace 0 to subscript
    const options = {
      ...nfCurrencyOptionsDefault,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    };
    return Intl.NumberFormat(locale, options)
      .format(0)
      .toString()
      .replace('0', subscript(num.toString()));
  }
  if (num.lt(0.01))
    return Intl.NumberFormat(locale, {
      ...nfCurrencyOptionsDefault,
      maximumFractionDigits: 4,
    }).format(num.toNumber());
  if (num.lt(0.1))
    return Intl.NumberFormat(locale, {
      ...nfCurrencyOptionsDefault,
      maximumFractionDigits: 3,
    }).format(num.toNumber());
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

/**
 * Work around prettifyNumber to support signed number
 * @dev this function is not meant to remains, so it doesn't support all cases supported by prettifyNumber
 * @todo(#909) update prettifyNumber and remove this function
 */
export const prettifySignedNumber = (
  num: number | string | SafeDecimal,
  options?: PrettifyNumberOptions
) => {
  const bigNum = new SafeDecimal(num);
  return bigNum.lt(0)
    ? `-${prettifyNumber(bigNum.abs(), options)}`
    : prettifyNumber(bigNum, options);
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
