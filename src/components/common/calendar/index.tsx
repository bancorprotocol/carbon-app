import { ComponentProps } from 'react';
import { DayPicker } from 'react-day-picker';
import KeyboardArrowDownIcon from 'assets/icons/keyboard_arrow_down.svg?react';
import './index.css';

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
      classNames={classNames}
      components={{
        Chevron: ({ orientation }) => {
          const rotate = orientation === 'left' ? 90 : -90;
          return (
            <KeyboardArrowDownIcon
              style={{ transform: `rotate(${rotate}deg)` }}
              className="size-24"
              data-testid={`date-picker-${orientation}-arrow`}
            />
          );
        },
      }}
      weekStartsOn={weekStartsOn}
      {...props}
    />
  );
};
