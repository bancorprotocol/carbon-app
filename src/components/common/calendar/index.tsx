import { ComponentProps } from 'react';
import { DayPicker } from 'react-day-picker';
import Chevron from 'assets/icons/chevron.svg?react';
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
            <Chevron
              style={{ transform: `rotate(${rotate}deg)` }}
              className="size-16"
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
