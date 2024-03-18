import { Button } from 'components/common/button';
import { Calendar, CalendarProps } from 'components/common/calendar';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { subDays, isSameDay, subMonths } from 'date-fns';
import { Dispatch, FormEvent, memo, ReactNode, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
import { fromUnixUTC, toUnixUTC } from 'components/simulator/utils';

export type DatePickerPreset = {
  label: string;
  days: number;
};

interface Props {
  button: ReactNode;
  defaultStart?: number | string;
  defaultEnd?: number | string;
  onConfirm: (props: { start: string; end: string }) => void;
  setIsOpen: Dispatch<boolean>;
  presets: DatePickerPreset[];
  options?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
}

export const DateRangePicker = memo((props: Omit<Props, 'setIsOpen'>) => {
  const [isOpen, setIsOpen] = useState(false);
  const Trigger = (attr: MenuButtonProps) => (
    <button
      {...attr}
      onClick={(e) => {
        setIsOpen(true);
        attr.onClick(e);
      }}
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

const Content = (props: Props) => {
  const now = new Date();
  const [date, setDate] = useState(
    getDefaultDateRange(props.defaultStart, props.defaultEnd)
  );
  const hasDates = !!(date?.from && date?.to);
  const selectedPreset = props.presets?.find((p) => {
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

  const onConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasDates) return;
    props.setIsOpen(false);
    props.onConfirm({
      start: toUnixUTC(date.from!),
      end: toUnixUTC(date.to!),
    });
  };

  return (
    <form
      className="gap-x-30 grid grid-cols-[200px_1fr] grid-rows-[1fr_auto] gap-y-20 p-20"
      onSubmit={onConfirm}
    >
      <div
        role="radiogroup"
        aria-label="presets"
        className="flex flex-col gap-5"
      >
        {props.presets.map(({ label, days }) => (
          <button
            type="button"
            role="radio"
            key={days}
            className="rounded-8 px-30 text-14 font-weight-500 hover:border-background-700 box-border border-2 border-transparent bg-clip-padding py-8 text-start [&[aria-checked=true]]:bg-black"
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
      <Button
        type="submit"
        disabled={!hasDates}
        size="sm"
        className="col-span-2 justify-self-end"
        data-testid="date-picker-confirm"
      >
        Confirm
      </Button>
    </form>
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
        <span className="flex size-24 items-center justify-center rounded-[12px] bg-white/10">
          <CalendarIcon className="size-12" />
        </span>

        <span
          className="text-14 justify-self-end text-white/80"
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
