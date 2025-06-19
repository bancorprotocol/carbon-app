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

/** Transform date to 00:00 UTC timestamp string*/
export const toUnixUTCDay = (date: Date) => {
  return getUnixTime(new Date(date.toISOString().split('T')[0])).toString();
};

/** Format date to DD/MM/YY */
export const dayFormatter = Intl.DateTimeFormat(undefined, {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
});

/** Format date to HH:MIN PM */
export const hourFormatter = Intl.DateTimeFormat(undefined, {
  hour12: true,
  hour: '2-digit',
  minute: '2-digit',
});
