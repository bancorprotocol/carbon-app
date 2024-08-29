import type { FiatSymbol } from 'utils/carbonApi';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';

export type NumberLike = number | string | SafeDecimal;

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
  if (!value) return '';
  if (value === '.') return '0';
  return new SafeDecimal(value).toString();
};

const getDisplayCurrency = (currency: string) => {
  // @ts-ignore: TS52072 supportedValuesOf is not yet supported in TypeScript 5.2
  if (!Intl.supportedValuesOf) return 'symbol';
  // @ts-ignore: TS52072 supportedValuesOf is not yet supported in TypeScript 5.2
  if (Intl.supportedValuesOf('currency').includes(currency)) return 'symbol';
  return 'name';
};

/**
 * Use string manipulation to display the value with high precision
 * @dev We need to split the number into integer & fraction because number is not precise enough
 */
const highPrecision = (
  num: SafeDecimal,
  formatter: Intl.NumberFormat,
  maxDecimals: number = 6
) => {
  if (num.lt(1)) return formatter.format(num.toNumber());
  // 12.12345678 -> 123456 (if maxDecimals is 6)
  const fraction = num
    .modulo(1)
    .toFixed(maxDecimals, SafeDecimal.ROUND_FLOOR)
    .slice(2)
    .replace(/0+$/, ''); // Remove trailing 0
  if (!fraction.length || !Number(fraction)) {
    return formatter.format(num.trunc().toNumber());
  }
  const result = formatter
    .formatToParts(num.toNumber())
    .map((part) => (part.type === 'fraction' ? fraction : part.value))
    .join('');
  return result;
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

const subscript = (num: number, formatter: Intl.NumberFormat) => {
  const transform = (part: Intl.NumberFormatPart) => {
    if (part.type !== 'fraction') return part.value;
    return part.value.replace(/0+/, (match) => {
      return `0${subscriptCharacters(match.length)}`;
    });
  };
  return formatter.formatToParts(num).map(transform).join('');
};

interface PrettifyNumberOptions {
  abbreviate?: boolean;
  currentCurrency?: FiatSymbol;
  highPrecision?: boolean;
  locale?: string;
  round?: boolean;
  decimals?: number;
  noSubscript?: boolean;
}

const getIntlOptions = (value: SafeDecimal, options: PrettifyNumberOptions) => {
  const intlOptions: Intl.NumberFormatOptions = {
    // @ts-ignore: TS52072 roundingMode is not yet supported in TypeScript 5.2
    roundingMode: 'trunc',
  };

  if (options.round) {
    // @ts-ignore: TS52072 roundingMode is not yet supported in TypeScript 5.2
    intlOptions.roundingMode = 'halfExpand';
  }

  // Currency
  if (options.currentCurrency) {
    const currency = options.currentCurrency;
    intlOptions.style = 'currency';
    intlOptions.currency = currency;
    intlOptions.currencyDisplay = getDisplayCurrency(currency);
    intlOptions.useGrouping = true;
  }

  if (options.abbreviate && value.gte(1_000_000)) {
    intlOptions.notation = 'compact';
  }
  return intlOptions;
};

export function prettifyNumber(
  value: NumberLike,
  options: PrettifyNumberOptions = {}
): string {
  const num = new SafeDecimal(value);
  const { locale = 'en-US' } = options;
  const intlOptions = getIntlOptions(num, options);

  // Force value to be positive
  if (num.lte(0)) {
    return Intl.NumberFormat(locale, {
      ...intlOptions,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0);
  }

  if (num.gte(1)) {
    intlOptions.minimumFractionDigits = 2;
    intlOptions.maximumFractionDigits = options.decimals ?? 2;
  } else if (num.gte(0.001)) {
    intlOptions.minimumFractionDigits = 2;
    intlOptions.maximumFractionDigits = options.decimals ?? 6;
  } else {
    intlOptions.maximumSignificantDigits = 5;
  }
  const formatter = new Intl.NumberFormat(locale, intlOptions);

  if (options.highPrecision) {
    return highPrecision(num, formatter, options.decimals);
  }

  if (!options.noSubscript && num.lt(0.001)) {
    return subscript(num.toNumber(), formatter);
  }

  return formatter.format(num.toNumber());
}

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

const firstZero = new RegExp(/^0+/);
const lastZero = new RegExp(/0+$/);

/** Round to 6 decimals after leading zeros */
export const roundSearchParam = (param?: string | number) => {
  if (!param || Number(param) === 0 || isNaN(Number(param))) return '';
  const [radix, decimals] = param.toString().split('.');
  if (!decimals) return param.toString();
  let maxDecimals = 6;
  if (Number(param) < 1) {
    maxDecimals += decimals.match(firstZero)?.[0].length ?? 0;
  }
  const roundedDecimals = decimals.slice(0, maxDecimals).replace(lastZero, '');
  return [radix, roundedDecimals].filter((v) => !!v).join('.');
};

export const tokenAmount = (
  amount: NumberLike | undefined,
  token: Token,
  options?: PrettifyNumberOptions
) => {
  if (amount === undefined || isNaN(Number(amount))) return;
  return `${prettifySignedNumber(Number(amount), options)} ${token.symbol}`;
};

export const tokenRange = (
  min: NumberLike,
  max: NumberLike,
  token: Token,
  options?: PrettifyNumberOptions
) => {
  if (min === max) return tokenAmount(min, token);
  const from = tokenAmount(min, token, options);
  const to = tokenAmount(max, token, options);
  return `${from} - ${to}`;
};
