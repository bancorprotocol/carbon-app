import { formatNumber } from 'utils/helpers';
export const isNil = (value?: string): value is '' | '0' | '.' | undefined => {
  if (!value) return true;
  return isZero(value);
};
export const isZero = (value: string): value is '0' | '.' => {
  if (!value) return false;
  return !+formatNumber(value);
};
