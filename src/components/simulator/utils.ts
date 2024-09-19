import { addMinutes, fromUnixTime, getUnixTime, subMinutes } from 'date-fns';

/** Get the date to be the same in a the UTC timezone */
export const toUnixUTC = (date: Date) => {
  const deltaMin = new Date(date).getTimezoneOffset();
  return getUnixTime(subMinutes(date, deltaMin)).toString();
};

/** Transform the date in UTC into the local timezone */
export function fromUnixUTC(): undefined;
export function fromUnixUTC(timestamp: string | number): Date;
export function fromUnixUTC(timestamp?: string | number): Date | undefined;
export function fromUnixUTC(timestamp?: string | number) {
  if (!timestamp) return;
  const date = fromUnixTime(Number(timestamp));
  const deltaMin = date.getTimezoneOffset();
  return addMinutes(date, deltaMin);
}

/** Format date to DD/MM/YY */
export const xAxisFormatter = Intl.DateTimeFormat(undefined, {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
});
