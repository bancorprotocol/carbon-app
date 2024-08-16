import { lsService } from 'services/localeStorage';
import config from 'config';
import { utils } from 'ethers';
import * as v from 'valibot';
import { formatNumber } from 'utils/helpers';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';

function toValue(mix: string | undefined) {
  if (!mix) return '';
  var str = decodeURIComponent(mix);
  if (str === 'false') return false;
  if (str === 'true') return true;
  if (str.startsWith('0x')) return str;
  if (str.startsWith('0X')) return str;
  return +str * 0 === 0 && +str + '' === str ? str : str;
}

export function decode(str: string) {
  let tmp,
    k,
    out: any = {},
    arr = str.split('&');

  while ((tmp = arr.shift())) {
    tmp = tmp.split('=');
    k = tmp.shift();
    if (k && out[k] !== void 0) {
      // @ts-ignore
      out[k] = [].concat(out[k], toValue(tmp.shift()));
    } else {
      // @ts-ignore
      out[k] = toValue(tmp.shift());
    }
  }

  return out;
}

export const parseSearchWith = (parser: (str: string) => any) => {
  return (searchStr: string): Record<string, any> => {
    if (searchStr.substring(0, 1) === '?') {
      searchStr = searchStr.substring(1);
    }

    let query: Record<string, unknown> = decode(searchStr);

    // Try to parse any query params that might be json
    for (let key in query) {
      if (key === 'quote' || key === 'base') {
        // eslint-disable-next-line
        query[key] = query[key];
      } else {
        const value = query[key];
        if (typeof value === 'string') {
          try {
            query[key] = parser(value);
          } catch (err) {
            //
          }
        }
      }
    }

    return query;
  };
};

export const getLastVisitedPair = () => {
  const [base, quote] =
    lsService.getItem('tradePair') || config.defaultTokenPair;

  return { base, quote };
};

// Validate Search Params //

export type SearchParamsValidator<T> = {
  [key in keyof T]: v.BaseSchema<any, any>;
};

export const validArrayOf = (schema: v.BaseSchema<string, any>) => {
  return v.array(schema);
};

export const validLiteral = (array: string[]) => {
  return v.union(array.map((l) => v.literal(l)));
};

export const validNumber = v.string([
  v.custom((value: string) => isNaN(Number(formatNumber(value))) === false),
]);

export const validNumberType = v.number();

export const validAddress = v.string([
  v.custom((value: string) => {
    try {
      utils.getAddress(value.toLocaleLowerCase());
      return true;
    } catch {
      return false;
    }
  }),
]);

export const validString = v.string();

export const validBoolean = v.boolean([
  v.custom((value) => value === true || value === false),
]);

export const validMarginalPrice = v.union([
  validNumber,
  validLiteral([MarginalPriceOptions.maintain, MarginalPriceOptions.reset]),
]);

export const validateSearchParams = <T>(
  validator: SearchParamsValidator<T>
) => {
  return (search: Record<string, string>): T => {
    for (const key in search) {
      const schema = validator[key as keyof T];
      if (schema && v.is(schema, search[key])) continue;
      delete search[key];
    }
    return search as T;
  };
};
