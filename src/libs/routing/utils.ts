import { lsService } from 'services/localeStorage';
import { config } from 'services/web3/config';
import { utils } from 'ethers';
import * as v from 'valibot';

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
            const parsed = parser(value);
            if (typeof parsed === 'number') {
              query[key] = parsed.toString();
            } else {
              query[key] = parsed;
            }
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
  const [base, quote] = lsService.getItem('tradePair') || [
    config.tokens.ETH,
    config.tokens.USDC,
  ];

  return { base, quote };
};

// Validate Search Params //

export type SearchParamsValidator<T> = {
  [key in keyof T]: v.BaseSchema<string, any>;
};

export const validLiteral = (array: string[]) => {
  return v.union(array.map((l) => v.literal(l)));
};
export const validNumber = v.string([
  v.custom((value: string) => isNaN(Number(value)) === false),
]);
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
export const validBoolean = v.boolean([
  v.custom((value) => value === true || value === false),
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
