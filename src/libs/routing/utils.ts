import { lsService } from 'services/localeStorage';
import { getAddress } from 'ethers';
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

export const validArrayOf = <T>(schema: v.GenericSchema<string, T>) => {
  return v.array(schema);
};

export const validNumber = v.pipe(
  v.string(),
  v.check((value: string) => isNaN(Number(formatNumber(value))) === false),
);
export const validInputNumber = v.optional(
  v.pipe(
    validNumber,
    v.check((value: string) => value === '.' || Number(value) >= 0),
  ),
  '0',
);

/** yyyy-mm-dd */
export const validDay = v.pipe(v.string(), v.regex(/\d{4}-\d{2}-\d{2}/));

export const validNumberType = v.number();

export const validAddress = v.fallback(
  v.pipe(
    v.string(),
    v.check((value: string) => {
      try {
        getAddress(value.toLocaleLowerCase());
        return true;
      } catch {
        return false;
      }
    }),
  ),
  '',
);

export const validPairFilter = v.optional(
  v.picklist(['all', 'large', 'rewards']),
);
export const validPairSort = v.optional(
  v.picklist([
    'pairAsc',
    'pairDesc',
    'trades',
    'trades24h',
    'liquidity',
    'strategyAmount',
  ]),
);
export const validStrategyFilter = v.optional(
  v.picklist(['all', 'active', 'inactive']),
);
export const validStrategySort = v.optional(
  v.picklist([
    'recent',
    'old',
    'pairAsc',
    'pairDesc',
    'totalBudgetDesc',
    'trades',
  ]),
);

export const validString = v.string();

export const validBoolean = v.pipe(
  v.boolean(),
  v.check((value) => value === true || value === false),
);

export const validMarginalPrice = v.union([
  validNumber,
  v.picklist([MarginalPriceOptions.maintain, MarginalPriceOptions.reset]),
]);

export type InferSearch<T extends v.ObjectEntries> = v.InferOutput<
  v.ObjectSchema<T, undefined>
>;

export const searchValidator = <T extends v.ObjectEntries>(validators: T) => {
  return valibotSearchValidator(v.object(validators));
};
