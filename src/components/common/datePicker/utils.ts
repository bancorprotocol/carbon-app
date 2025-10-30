import { Duration } from 'date-fns';

export type DatePickerPreset = {
  label: string;
  duration: Duration;
  days?: number;
  months?: number;
  years?: number;
};
export const datePickerPresets: DatePickerPreset[] = [
  { label: 'Last 7 days', duration: { days: 6 } },
  { label: 'Last 30 days', duration: { days: 29 } },
  { label: 'Last 90 days', duration: { days: 89 } },
  { label: 'Last 365 days', duration: { days: 364 } },
];
