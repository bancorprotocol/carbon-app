import { Button } from 'components/common/button';
import { Calendar, CalendarProps } from 'components/common/calendar';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { subDays, isSameDay, subMonths } from 'date-fns';
import { Dispatch, memo, ReactNode, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
import { fromUnixUTC, toUnixUTC } from 'components/simulator/utils';

export const datePickerPresets: DatePickerPreset[] = [
  { label: 'Last 7 days', days: 6 },
  { label: 'Last 30 days', days: 29 },
  { label: 'Last 90 days', days: 89 },
  { label: 'Last 365 days', days: 364 },
];

export type DatePickerPreset = {
  label: string;
  days: number;
};

interface Props {
  button: ReactNode;
  defaultStart?: number | string;
  defaultEnd?: number | string;
  start?: number | string;
  end?: number | string;
  onConfirm: (props: { start?: string; end?: string }) => void;
  setIsOpen: Dispatch<boolean>;
  presets: DatePickerPreset[];
  options?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
  required?: boolean;
  form?: string;
}

export const DateRangePicker = memo((props: Omit<Props, 'setIsOpen'>) => {
  const [isOpen, setIsOpen] = useState(false);
  const Trigger = (attr: MenuButtonProps) => (
    <button
      {...attr}
      type="button"
      aria-label="Pick date range"
      className="flex items-center gap-8"
      data-testid="date-picker-button"
    >
      {props.button}
    </button>
  );

  return (
    <DropdownMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      placement="bottom-start"
      strategy="fixed"
      aria-expanded={isOpen}
      button={Trigger}
    >
      <Content {...props} setIsOpen={setIsOpen} />
    </DropdownMenu>
  );
});

const getDefaultDateRange = (
  start?: number | string,
  end?: number | string
): DateRange | undefined => {
  if (!start || !end) return undefined;
  return {
    from: fromUnixUTC(start),
    to: fromUnixUTC(end),
  };
};

/** Transform date into YYYY-MM-DD */
const toDateInput = (date?: Date) => date?.toISOString().split('T')[0] ?? '';

const Content = (props: Props) => {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const now = new Date();
  const baseDate = getDefaultDateRange(
    props.defaultStart ?? props.start,
    props.defaultEnd ?? props.end
  );
  const [date, setDate] = useState(baseDate);
  const hasDates = !!(date?.from && date?.to);
  const selectedPreset = props.presets.find((p) => {
    if (!hasDates) return false;
    const from = subDays(now, p.days);
    return isSameDay(from, date?.from!) && isSameDay(date?.to!, now);
  });

  const handlePreset = (days: number) => {
    setDate({
      from: subDays(now, days),
      to: now,
    });
  };

  const onConfirm = () => {
    if (props.required && !hasDates) return;
    props.setIsOpen(false);
    startRef.current!.value = toDateInput(date?.from);
    endRef.current!.value = toDateInput(date?.to);
    props.onConfirm({
      start: date?.from && toUnixUTC(date.from),
      end: date?.to && toUnixUTC(date.to),
    });
  };

  const onReset = () => {
    setDate(getDefaultDateRange(props.defaultStart, props.defaultEnd));
  };

  return (
    <div className="flex flex-col gap-20 p-20">
      <div className="flex gap-30">
        <div
          role="radiogroup"
          aria-label="presets"
          className="flex w-[200px] flex-col gap-5"
        >
          {props.presets.map(({ label, days }) => (
            <button
              type="button"
              role="radio"
              key={days}
              className="box-border rounded-8 border-2 border-transparent bg-clip-padding py-8 px-30 text-start text-14 font-weight-500 hover:border-background-700 [&[aria-checked=true]]:bg-black"
              onClick={() => handlePreset(days)}
              aria-checked={selectedPreset?.days === days}
              data-testid="date-picker-button"
            >
              {label}
            </button>
          ))}
        </div>
        <Calendar
          defaultMonth={subMonths(date?.to ?? new Date(), 1)}
          numberOfMonths={2}
          {...props.options}
          mode="range"
          selected={date}
          onSelect={setDate}
        />
      </div>
      <footer className="flex justify-end gap-16">
        <input
          ref={startRef}
          form={props.form}
          name="start"
          type="date"
          hidden
          defaultValue={toDateInput(date?.from)}
        />
        <input
          ref={endRef}
          form={props.form}
          name="end"
          type="date"
          hidden
          defaultValue={toDateInput(date?.to)}
        />
        <Button
          type="button"
          variant="black"
          size="sm"
          className="col-span-2 justify-self-start"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          form={props.form}
          type="submit"
          disabled={props.required && !hasDates}
          size="sm"
          className="col-span-2 justify-self-end"
          data-testid="date-picker-confirm"
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </footer>
    </div>
  );
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

interface DatePickerButtonProps {
  start?: Date;
  end?: Date;
}

export const DatePickerButton = memo(
  ({ start, end }: DatePickerButtonProps) => {
    const startDate = dateFormatter.format(start);
    const endDate = dateFormatter.format(end);

    const hasDates = !!(start && end);

    return (
      <>
        <span className="flex h-24 w-24 items-center justify-center rounded-[12px] bg-white/10">
          <CalendarIcon className="h-12 w-12" />
        </span>

        <span
          className="justify-self-end text-14 text-white/80"
          data-testid="simulation-dates"
        >
          {hasDates ? (
            <>
              {startDate} – {endDate}
            </>
          ) : (
            'Select date range'
          )}
        </span>
      </>
    );
  }
);
