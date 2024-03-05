import { ComponentProps } from 'react';
import { DayPicker } from 'react-day-picker';
import { ReactComponent as Chevron } from 'assets/icons/chevron.svg';
import { cn } from 'utils/helpers';

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
      className={className}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-30',
        month: 'flex flex-col gap-20',
        caption: 'flex items-center',
        caption_start: '[&>:first-child]:flex-row-reverse',
        caption_label: 'flex-1 text-center text-14',
        nav: 'gap-10 flex items-center',
        nav_button: 'h-16 w-16 bg-transparent opacity-50 hover:opacity-100',
        table: 'border-collapse',
        head_row: 'flex m-b-1',
        head_cell: 'text-white/20 rounded-8 w-36 text-12 font-weight-400',
        row: 'flex w-full mt-4',
        cell: 'p-0 text-14',
        day: cn(
          'text-white/60 h-32 w-36 p-0 rounded-8 border-box',
          'focus-visible:border focus-visible:border-white/50 focus-visible:outline-none',
          'hover:bg-background-900 hover:text-white'
        ),
        day_selected:
          'focus-visible:bg-primary/80 font-weight-500 text-white bg-primary/20 rounded-0 [&:not(.outside)]:opacity-100',
        day_range_start:
          'rounded-l-8 [&:not(.outside)]:bg-primary [&:not(.outside)]:text-black',
        day_range_end:
          'rounded-r-8 [&:not(.outside)]:bg-primary [&:not(.outside)]:text-black',
        day_today: 'border border-white/80',
        day_outside: 'outside opacity-20',
        day_disabled: 'text-white/20 opacity-50',
        day_range_middle: 'aria-selected:bg-primary/20',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <Chevron
            className="h-16 w-16 rotate-90"
            data-testid="date-picker-left-arrow"
          />
        ),
        IconRight: () => (
          <Chevron
            className="h-16 w-16 -rotate-90"
            data-testid="date-picker-right-arrow"
          />
        ),
      }}
      weekStartsOn={weekStartsOn}
      {...props}
    />
  );
};
