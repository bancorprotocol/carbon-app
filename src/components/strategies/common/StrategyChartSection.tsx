import { FC, ReactNode } from 'react';
import {
  DateRangePicker,
  datePickerPresets,
} from 'components/common/datePicker/DateRangePicker';
import {
  defaultEndDate,
  defaultStartDate,
} from 'components/strategies/common/utils';
import { fromUnixUTC, toUnixUTC } from 'components/simulator/utils';
import { datePickerDisabledDays } from 'components/simulator/result/SimResultChartHeader';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { TradeSearch } from 'libs/routing';
import config from 'config';

interface Props {
  children: ReactNode;
}

export const StrategyChartSection: FC<Props> = ({ children }) => {
  const navigate = useNavigate({ from: '/trade' });
  const { priceStart, priceEnd } = useSearch({ strict: false }) as TradeSearch;
  const onDatePickerConfirm = (props: { start?: Date; end?: Date }) => {
    const { start, end } = props;
    if (!start || !end) return;
    navigate({
      search: (previous) => ({
        ...previous,
        priceStart: toUnixUTC(start),
        priceEnd: toUnixUTC(end),
      }),
      resetScroll: false,
      replace: true,
    });
  };
  const isNativeChart = config.ui.priceChart === 'native';
  return (
    <section
      aria-labelledby="price-chart-title"
      className="bg-background-900 sticky top-[80px] flex h-[600px] flex-col gap-20 rounded p-20"
    >
      <header className="flex items-center justify-between gap-20">
        <h2 id="price-chart-title" className="text-18">
          Price Chart
        </h2>
        {isNativeChart && (
          <DateRangePicker
            defaultStart={defaultStartDate()}
            defaultEnd={defaultEndDate()}
            start={fromUnixUTC(priceStart)}
            end={fromUnixUTC(priceEnd)}
            onConfirm={onDatePickerConfirm}
            presets={datePickerPresets}
            options={{
              disabled: datePickerDisabledDays,
            }}
            required
          />
        )}
      </header>
      {children}
    </section>
  );
};
