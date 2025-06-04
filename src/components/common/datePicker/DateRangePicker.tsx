import { Button } from 'components/common/button';
import { Calendar, CalendarProps } from 'components/common/calendar';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import {
  isSameDay,
  subMonths,
  startOfDay,
  endOfDay,
  format,
  sub,
  Duration,
} from 'date-fns';
import { Dispatch, memo, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { cn } from 'utils/helpers';
import { useBreakpoints } from 'hooks/useBreakpoints';

export const datePickerPresets: DatePickerPreset[] = [
  { label: 'Last 7 days', duration: { days: 6 } },
  { label: 'Last 30 days', duration: { days: 29 } },
  { label: 'Last 90 days', duration: { days: 89 } },
  { label: 'Last 365 days', duration: { days: 364 } },
];

export type DatePickerPreset = {
  label: string;
  duration: Duration;
  days?: number;
  months?: number;
  years?: number;
};

interface Props {
  /** Value used to be reset to when user click on reset */
  defaultStart?: Date;
  /** Value used to be reset to when user click on reset */
  defaultEnd?: Date;
  /** Current start value */
  start?: Date;
  /** Current end value */
  end?: Date;
  onConfirm: (props: { start?: Date; end?: Date }) => void;
  setIsOpen: Dispatch<boolean>;
  presets?: DatePickerPreset[];
  options?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
  required?: boolean;
  form?: string;
  disabled?: boolean;
  className?: string;
}

const displayRange = (start?: Date, end?: Date) => {
  if (!start || !end) return 'Select Date Range';
  if (isSameDay(start, end)) return dateFormatter.format(start);
  return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
};

export const DateRangePicker = memo(function DateRangePicker(
  props: Omit<Props, 'setIsOpen'>,
) {
  const [isOpen, setIsOpen] = useState(false);

  const hasDates = !!(props.start && props.end);
  const Trigger = (attr: MenuButtonProps) => (
    <button
      {...attr}
      type="button"
      aria-label="Pick date range"
      className={cn(
        'text-12 flex items-center gap-8 rounded-full border-2 px-12 py-8',
        'hover:bg-background-800',
        hasDates
          ? 'border-white/60 active:border-white/80'
          : 'border-background-800 hover:border-background-700 active:border-background-600',
        props.disabled &&
          'border-background-800 hover:border-background-800 active:border-background-800 cursor-not-allowed hover:bg-transparent',
        props.className,
      )}
      data-testid="date-picker-button"
      disabled={props.disabled}
    >
      <CalendarIcon className="text-primary size-14" />
      <span
        className="justify-self-end text-white/60"
        data-testid="simulation-dates"
      >
        {displayRange(props.start, props.end)}
      </span>
      {!props.disabled && (
        <ChevronIcon
          className={cn('h-12 w-12 text-white/80 transition-transform', {
            'rotate-180': isOpen,
          })}
        />
      )}
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
  start?: Date,
  end?: Date,
): DateRange | undefined => {
  if (!start || !end) return undefined;
  return {
    from: start,
    to: end,
  };
};

/** Transform date into yyyy-MM-dd */
const toDateInput = (date?: Date) => {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
};

const Content = (props: Props) => {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const now = new Date();
  const baseDate = getDefaultDateRange(
    props.start ?? props.defaultStart,
    props.end ?? props.defaultEnd,
  );
  const [date, setDate] = useState(baseDate);
  const hasDates = !!(date?.from && date?.to);
  const selectedPreset = props.presets?.find((p) => {
    if (!hasDates) return false;
    const from = sub(now, p.duration);
    return isSameDay(from, date.from!) && isSameDay(date.to!, now);
  });

  const { aboveBreakpoint } = useBreakpoints();

  const handlePreset = (duration: Duration) => {
    setDate({
      from: sub(startOfDay(now), duration),
      to: startOfDay(now),
    });
  };

  const onConfirm = () => {
    if (props.required && !hasDates) return;
    let from = date?.from;
    if (!from && date?.to) from = startOfDay(date?.to);
    let to = date?.to;
    if (!to && date?.from) to = endOfDay(date?.from);
    startRef.current!.value = toDateInput(from);
    endRef.current!.value = toDateInput(to);
    props.onConfirm({ start: from, end: to });
    props.setIsOpen(false);
  };

  const onReset = () => {
    setDate(getDefaultDateRange(props.defaultStart, props.defaultEnd));
  };

  return (
    <div className="grid min-h-[375px] gap-20 p-20">
      <div className="gap-30 flex">
        {!!props.presets && (
          <div
            role="radiogroup"
            aria-label="presets"
            className="hidden w-[200px] flex-col gap-5 md:flex"
          >
            {props.presets.map(({ label, duration }, i) => (
              <button
                type="button"
                role="radio"
                key={i}
                className="rounded-8 px-30 text-14 font-weight-500 hover:border-background-700 box-border border-2 border-transparent bg-clip-padding py-8 text-start [&[aria-checked=true]]:bg-black"
                onClick={() => handlePreset(duration)}
                aria-checked={selectedPreset?.label === label}
                data-testid="date-picker-button"
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <Calendar
          defaultMonth={subMonths(date?.to ?? new Date(), 1)}
          numberOfMonths={aboveBreakpoint('sm') ? 2 : 1}
          {...props.options}
          mode="range"
          selected={date}
          onSelect={setDate}
        />
      </div>
      <footer className="flex justify-end gap-16 self-end">
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
          type="button"
          disabled={props.required && !hasDates}
          size="sm"
          variant="success"
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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

interface DatePickerButtonProps {
  start?: Date;
  end?: Date;
}

export const DatePickerButton = memo(function DatePickerButton({
  start,
  end,
}: DatePickerButtonProps) {
  const startDate = dateFormatter.format(start);
  const endDate = dateFormatter.format(end);

  const hasDates = !!(start && end);

  return (
    <>
      <CalendarIcon className="text-primary size-14" />
      <span
        className="justify-self-end text-white/60"
        data-testid="simulation-dates"
      >
        {hasDates ? `${startDate} - ${endDate}` : 'Select Date Range'}
      </span>
      <ChevronIcon className="size-12 rotate-180 text-white/80" />
    </>
  );
});
