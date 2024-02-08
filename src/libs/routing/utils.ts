import { lsService } from 'services/localeStorage';
import { config } from 'services/web3/config';
import { utils } from 'ethers';

export const getLastVisitedPair = () => {
  const [base, quote] = lsService.getItem('tradePair') || [
    config.tokens.ETH,
    config.tokens.USDC,
  ];

  return { base, quote };
};

// Validate Search Params //

export type SearchParamsValidator<T> = {
  [key in keyof T]: (value: string) => boolean;
};

export const validAddress = (value: string) => utils.isAddress(value);
export const validNumber = (value: string) => isNaN(Number(value)) === false;
export const validLiteral = (array: string[]) => (value: string) => {
  return array.includes(value);
};
export const validateSearchParams = <T>(
  validator: SearchParamsValidator<T>
) => {
  return (search: Record<string, string>): T => {
    for (const key in search) {
      if (validator[key as keyof T]?.(search[key])) continue;
      delete search[key];
    }
    return search as T;
  };
};
