import type { FiatSymbol } from 'utils/carbonApi';
import numbro from 'numbro';
import BigNumber from 'bignumber.js';

export const getFiatDisplayValue = (
  fiatValue: BigNumber | string | number,
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

export function prettifyNumber(num: number | string | BigNumber): string;
export function prettifyNumber(
  num: number | string | BigNumber,
  options?: PrettifyNumberOptions
): string;
export function prettifyNumber(
  num: number | string | BigNumber,
  options?: PrettifyNumberOptions
): string {
  const {
    abbreviate = false,
    highPrecision = false,
    round = false,
  } = options || {};

  const bigNum = new BigNumber(num);
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

const handlePrettifyNumberCurrency = (
  num: BigNumber,
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
    currencyDisplay:
      // @ts-ignore: supportedValuesOf supported from TypeScript 5.1
      Intl.supportedValuesOf &&
      // @ts-ignore: supportedValuesOf supported from TypeScript 5.1
      Intl.supportedValuesOf('currency').includes(currentCurrency)
        ? 'symbol'
        : 'name',
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

  if (!highPrecision && num.gt(100))
    return Intl.NumberFormat(locale, {
      ...nfCurrencyOptionsDefault,
      maximumFractionDigits: 0,
    }).format(num.toNumber());

  return Intl.NumberFormat(locale, nfCurrencyOptionsDefault).format(
    num.toNumber()
  );
};
