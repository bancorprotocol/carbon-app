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
import { Dispatch, memo, ReactElement, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { cn } from 'utils/helpers';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { DatePickerPreset } from './utils';

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
  icon?: ReactElement;
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
        'text-12 flex items-center gap-8 rounded-full px-12 py-8 text-white/60 data-[selected=true]:text-white',
        props.disabled &&
          'border-main-800 hover:border-main-800 active:border-main-800 cursor-not-allowed hover:bg-transparent',
        props.className,
      )}
      data-selected={hasDates}
      data-testid="date-picker-button"
      disabled={props.disabled}
    >
      {props.icon}
      <span className="justify-self-end" data-testid="simulation-dates">
        {displayRange(props.start, props.end)}
      </span>
      {!props.disabled && (
        <ChevronIcon
          className={cn('ml-auto size-12 transition-transform', {
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
                className="rounded-md px-30 text-14 font-medium hover:bg-black/40 box-border border border-transparent bg-clip-padding py-8 text-start aria-checked:bg-black/60"
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
        <button
          type="button"
          className="btn col-span-2 justify-self-start px-16 py-8 rounded-full"
          onClick={onReset}
        >
          Reset
        </button>
        <button
          form={props.form}
          type="button"
          disabled={props.required && !hasDates}
          className="btn-primary-gradient col-span-2 justify-self-end"
          data-testid="date-picker-confirm"
          onClick={onConfirm}
        >
          Confirm
        </button>
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
  const _sD_ = dateFormatter.format(start);
  const _eD_ = dateFormatter.format(end);

  const hasDates = !!(start && end);

  return (
    <>
      <CalendarIcon className="text-primary size-14" />
      <span
        className="justify-self-end text-white/60"
        data-testid="simulation-dates"
      >
        {hasDates ? `${_sD_} - ${_eD_}` : 'Select Date Range'}
      </span>
      <ChevronIcon className="size-12 rotate-180 text-white/80" />
    </>
  );
});
