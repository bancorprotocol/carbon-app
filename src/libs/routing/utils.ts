import { lsService } from 'services/localeStorage';
import { utils } from 'ethers';
import { formatNumber } from 'utils/helpers';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { valibotSearchValidator } from '@tanstack/router-valibot-adapter';
import * as v from 'valibot';
import config from 'config';

export const getLastVisitedPair = () => {
  const [base, quote] =
    lsService.getItem('tradePair') || config.defaultTokenPair;

  return { base, quote };
};

// Validate Search Params //

export type SearchParamsValidator<T> = {
  [key in keyof T]: v.GenericSchema<any, any>;
};

export const validArrayOf = (schema: v.GenericSchema<string, any>) => {
  return v.array(schema);
};

export const validLiteral = (array: string[]) => {
  return v.union(array.map((l) => v.literal(l)));
};

export const validNumber = v.pipe(
  v.string(),
  v.check((value: string) => isNaN(Number(formatNumber(value))) === false)
);
export const validPositiveNumber = v.fallback(
  v.pipe(
    validNumber,
    v.check((value: string) => Number(value) >= 0)
  ),
  '0'
);

export const validNumberType = v.number();

export const validAddress = v.pipe(
  v.string(),
  v.check((value: string) => {
    try {
      utils.getAddress(value.toLocaleLowerCase());
      return true;
    } catch {
      return false;
    }
  })
);

export const validString = v.string();

export const validBoolean = v.pipe(
  v.boolean(),
  v.check((value) => value === true || value === false)
);

export const validMarginalPrice = v.union([
  validNumber,
  validLiteral([MarginalPriceOptions.maintain, MarginalPriceOptions.reset]),
]);

type WithOptional<T extends v.ObjectEntries> = {
  [key in keyof T]: T[key] extends v.OptionalSchema<infer a, infer b>
    ? T[key]
    : v.OptionalSchema<T[key], never>;
};
export type InferSearch<T extends v.ObjectEntries> = v.InferOutput<
  v.ObjectSchema<WithOptional<T>, undefined>
>;

export const searchValidator = <T extends v.ObjectEntries>(validators: T) => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(validators)) {
    if (value.type === 'optional') result[key] = value;
    else result[key] = v.optional(value);
  }
  return valibotSearchValidator(v.object(result as WithOptional<T>));
};

export const validateSearchParams = <T>(
  validator: SearchParamsValidator<T>
) => {
  return (search: Record<string, string>): T => {
    for (const key in search) {
      const schema = validator[key as keyof T];
      if (schema && v.is(schema, search[key])) {
        search[key] = v.parse(schema, search[key]);
      }
      if (search[key] === undefined) {
        delete search[key];
      }
    }
    return search as T;
  };
};
