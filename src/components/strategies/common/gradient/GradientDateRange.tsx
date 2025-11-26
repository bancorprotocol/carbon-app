import { Button } from 'components/common/button';
import { Calendar, CalendarProps } from 'components/common/calendar';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { isSameDay, subMonths, startOfDay, endOfDay, addDays } from 'date-fns';
import { Dispatch, memo, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import CalendarIcon from 'assets/icons/calendar.svg?react';
import ChevronIcon from 'assets/icons/chevron.svg?react';
import { cn } from 'utils/helpers';
import { useBreakpoints } from 'hooks/useBreakpoints';

const datePickerPresets: DatePickerPreset[] = [
  { label: '1D', days: 0 },
  { label: '7D', days: 6 },
  { label: '14D', days: 13 },
  { label: '1M', days: 29 },
  { label: '3M', days: 89 },
];

export type DatePickerPreset = {
  label: string;
  days: number;
};

export interface RangeDate {
  start?: Date;
  end?: Date;
}

interface Props {
  /** Value used to be reset to when user click on reset */
  defaultStart: Date;
  /** Value used to be reset to when user click on reset */
  defaultEnd: Date;
  /** Current start value */
  start?: Date;
  /** Current end value */
  end?: Date;
  onConfirm: (props: RangeDate) => void;
  setIsOpen: Dispatch<boolean>;
  options?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
  required?: boolean;
  form?: string;
  className?: string;
}

const displayRange = (start?: Date, end?: Date) => {
  if (!start || !end) return 'Select Time Range';
  if (isSameDay(start, end)) return dateFormatter.format(start);
  return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
};

export const GradientDateRange = memo(function TimeRange(
  props: Omit<Props, 'setIsOpen'>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const Trigger = (attr: MenuButtonProps) => (
    <button
      {...attr}
      type="button"
      aria-label="Pick date range"
      className={cn(
        'text-12 flex items-center gap-8 rounded-full border border-transparent btn-tertiary-gradient px-12 py-8',
        'outline-1 outline-white/60 focus-visible:outline-solid',
        props.className,
      )}
      data-testid="date-picker-button"
    >
      <CalendarIcon className="text-primary size-14" />
      <span
        className="mr-auto mr-auto justify-self-end text-white/60"
        data-testid="simulation-dates"
      >
        {displayRange(props.start, props.end)}
      </span>
      <ChevronIcon
        className={cn('h-12 w-12 text-white/80 transition-transform', {
          'rotate-180': isOpen,
        })}
      />
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

const Content = (props: Props) => {
  const now = new Date();
  const defaultRange = getDefaultDateRange(
    props.start ?? props.defaultStart,
    props.end ?? props.defaultEnd,
  );
  const [range, setRange] = useState(defaultRange);
  const hasDates = !!(range?.from && range?.to);
  const selectedPreset = datePickerPresets.find((p) => {
    if (!hasDates) return false;
    const to = addDays(now, p.days);
    return isSameDay(now, range.from!) && isSameDay(to, range.to!);
  });

  const startTime = useMemo(() => {
    if (!range?.from) return '';
    if (range.from < startOfDay(new Date())) return '00:00:00';
    if (range.from > endOfDay(new Date())) return '00:00:00';
    return 'On Execution';
  }, [range?.from]);

  const { aboveBreakpoint } = useBreakpoints();

  const handlePreset = (days: number) => {
    setRange({
      from: now,
      to: addDays(now, days),
    });
  };

  const onConfirm = () => {
    if (props.required && !hasDates) return;
    let from = range?.from;
    if (!from && range?.to) from = startOfDay(range?.to);
    let to = range?.to;
    if (!to && range?.from) to = endOfDay(range?.from);
    props.onConfirm({ start: from, end: to });
    props.setIsOpen(false);
  };

  const onReset = () => {
    setRange(getDefaultDateRange(props.defaultStart, props.defaultEnd));
  };

  return (
    <div className="flex">
      <div
        role="radiogroup"
        aria-label="presets"
        className="hidden flex-col gap-5 p-16 md:flex"
      >
        {datePickerPresets.map(({ label, days }) => (
          <button
            type="button"
            role="radio"
            key={days}
            className="rounded-md px-30 text-14 font-medium hover:bg-main-900/40 box-border border border-transparent bg-clip-padding py-8 text-start aria-checked:bg-main-900/60"
            onClick={() => handlePreset(days)}
            aria-checked={selectedPreset?.days === days}
            data-testid="date-picker-button"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-20 p-16">
        <Calendar
          defaultMonth={subMonths(range?.to ?? new Date(), 1)}
          numberOfMonths={aboveBreakpoint('sm') ? 2 : 1}
          {...props.options}
          mode="range"
          selected={range}
          onSelect={setRange}
        />
        <div className="flex gap-20">
          {startTime && (
            <p className="bg-main-900 flex flex-1 items-center gap-8 rounded-full px-16 py-8">
              <span className="text-10 text-white/60">Start Time</span>
              <time className="text-12 font-medium">{startTime}</time>
            </p>
          )}
          {range?.to && (
            <p className="bg-main-900 flex flex-1 items-center gap-8 rounded-full px-16 py-8">
              <span className="text-10 text-white/60">End Time</span>
              <time className="text-12 font-medium">23:59:59</time>
            </p>
          )}
        </div>
        <footer className="flex justify-end gap-16">
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
    </div>
  );
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});
