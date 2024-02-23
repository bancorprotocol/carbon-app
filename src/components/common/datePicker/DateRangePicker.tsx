import { Button } from 'components/common/button';
import { Calendar, CalendarProps } from 'components/common/calendar';
import { DropdownMenu, MenuButtonProps } from 'components/common/dropdownMenu';
import { subDays, getUnixTime, isSameDay } from 'date-fns';
import { memo, ReactNode, useState } from 'react';
import { DateRange } from 'react-day-picker';

export type DatePickerPreset = {
  label: string;
  days: number;
};

interface Props {
  button: ReactNode;
  defaultStart: number;
  defaultEnd: number;
  onConfirm: (props: { start: string; end: string }) => void;
  presets?: DatePickerPreset[];
  options?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
}

export const DateRangePicker = memo((props: Props) => {
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
      aria-expanded={isOpen}
      button={Trigger}
    >
      <Content {...props} />
    </DropdownMenu>
  );
});

const disabledDays = [{ after: new Date(), before: subDays(new Date(), 365) }];

const Content = (props: Props) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Number(props.defaultStart) * 1000),
    to: new Date(Number(props.defaultEnd) * 1000),
  });
  const hasDates = !!(date?.from && date?.to);
  const selectedPreset = props.presets?.find((p) => {
    if (!hasDates) {
      return false;
    }

    const from = subDays(new Date(), p.days);
    return isSameDay(from, date?.from!);
  });

  const handlePreset = (days: number) => {
    setDate({
      from: subDays(new Date(), days),
      to: new Date(),
    });
  };

  const onConfirm = () => {
    if (!hasDates) {
      return;
    }

    props.onConfirm({
      start: getUnixTime(date.from!).toString(),
      end: getUnixTime(date.to!).toString(),
    });
  };

  return (
    <div className="space-y-20 p-20">
      <div className="flex space-x-30">
        {props.presets && (
          <div className="w-200 space-y-5">
            {props.presets.map(({ label, days }) => (
              <Button
                key={days}
                variant={selectedPreset?.days === days ? 'black' : 'secondary'}
                className="rounded-8"
                fullWidth
                onClick={() => handlePreset(days)}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
        <Calendar
          defaultMonth={date?.to}
          numberOfMonths={2}
          disabled={disabledDays}
          {...props.options}
          mode="range"
          selected={date}
          onSelect={setDate}
        />
      </div>
      <div className="flex w-full justify-end">
        <Button onClick={onConfirm} disabled={!hasDates} size="sm">
          Confirm
        </Button>
      </div>
    </div>
  );
};
