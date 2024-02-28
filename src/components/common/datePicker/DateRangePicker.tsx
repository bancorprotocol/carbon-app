import { Button } from 'components/common/button';
import { Calendar, CalendarProps } from 'components/common/calendar';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { subDays, getUnixTime, isSameDay, subMonths } from 'date-fns';
import { Dispatch, memo, ReactNode, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';

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
      aria-label="Pick date range"
      className="flex items-center gap-8"
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
    from: new Date(Number(start) * 1000),
    to: new Date(Number(end) * 1000),
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

  const onConfirm = () => {
    if (!hasDates) return;
    props.setIsOpen(false);
    props.onConfirm({
      start: getUnixTime(date.from!.toUTCString()).toString(),
      end: getUnixTime(date.to!.toUTCString()).toString(),
    });
  };

  return (
    <form
      method="dialog"
      className="grid grid-cols-[200px_1fr] grid-rows-[1fr_auto] gap-x-30 gap-y-20 p-20"
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
            className="box-border rounded-8 border-2 border-transparent bg-clip-padding py-8 px-30 text-start text-14 font-weight-500 hover:border-grey3 [&[aria-checked=true]]:bg-black"
            onClick={() => handlePreset(days)}
            aria-checked={selectedPreset?.days === days}
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
  startUnix?: string | number;
  endUnix?: string | number;
}

export const DatePickerButton = memo(
  ({ startUnix, endUnix }: DatePickerButtonProps) => {
    const startDate = dateFormatter.format(Number(startUnix) * 1e3);
    const endDate = dateFormatter.format(Number(endUnix) * 1e3);

    const hasDates = !!(startUnix && endUnix);

    return (
      <>
        <span className="flex h-24 w-24 items-center justify-center rounded-[12px] bg-white/10">
          <CalendarIcon className="h-12 w-12" />
        </span>

        <span className="justify-self-end text-14 text-white/80">
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
