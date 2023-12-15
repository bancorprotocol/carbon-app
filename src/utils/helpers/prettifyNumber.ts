import type { FiatSymbol } from 'utils/carbonApi';
import { SafeDecimal } from 'libs/safedecimal';
import numbro from 'numbro';

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
