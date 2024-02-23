import { ComponentProps } from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from 'utils/helpers';
import { ReactComponent as Chevron } from 'assets/icons/chevron.svg';

export type CalendarProps = ComponentProps<typeof DayPicker>;

export const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  weekStartsOn = 1,
  ...props
}: CalendarProps) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-x-30',
        month: 'space-y-20',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-14',
        nav: 'space-x-10 flex items-center',
        nav_button: cn(
          'h-16 w-16 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-white/20 rounded-8 w-36 text-12 font-weight-400',
        row: 'flex w-full mt-4',
        cell: cn(
          'relative p-0 text-center text-14 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-green/20 [&:has([aria-selected].day-range-end)]:rounded-r-8 [&:has([aria-selected].day-range-end.day-outside)]:bg-transparent [&:has([aria-selected].day-range-start.day-outside)]:bg-transparent',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-8 [&:has(>.day-range-start)]:rounded-l-8 first:[&:has([aria-selected])]:rounded-l-8 last:[&:has([aria-selected])]:rounded-r-8'
            : '[&:has([aria-selected])]:rounded-8'
        ),
        day: cn(
          'text-white/60 h-32 w-36 p-0 aria-selected:opacity-100 focus:border focus:border-white/50 focus:outline-none hover:bg-silver rounded-8'
        ),
        day_range_start: 'day-range-start bg-green rounded-r-0 text-black',
        day_range_end: 'day-range-end bg-green rounded-l-0 text-black',
        day_selected: 'focus:bg-green font-weight-500 text-white',
        day_today: 'bg-blue text-white',
        day_outside: 'day-outside opacity-20',
        day_disabled: 'text-white/20 opacity-50',
        day_range_middle: 'aria-selected:bg-green/20',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <Chevron className="h-16 w-16 rotate-90" />,
        IconRight: ({ ...props }) => (
          <Chevron className="h-16 w-16 -rotate-90" />
        ),
      }}
      weekStartsOn={weekStartsOn}
      {...props}
    />
  );
};
