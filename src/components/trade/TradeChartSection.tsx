import { TradingviewChart } from 'components/tradingviewChart';
import { useTradeCtx } from './TradeContext';
import { FC, ReactNode } from 'react';
import {
  DateRangePicker,
  datePickerPresets,
} from 'components/common/datePicker/DateRangePicker';
import { defaultEndDate, defaultStartDate } from 'pages/simulator';
import { fromUnixUTC, toUnixUTC } from 'components/simulator/utils';
import { datePickerDisabledDays } from 'components/simulator/result/SimResultChartHeader';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { TradeSearch } from 'libs/routing';
import config from 'config';

interface Props {
  children: ReactNode;
}

export const TradeChartSection: FC<Props> = ({ children }) => {
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

  return (
    <section
      aria-labelledby="price-chart-title"
      className="bg-background-900 sticky top-[80px] flex max-h-[600px] min-h-[400px] flex-col gap-20 rounded p-20"
    >
      <header className="flex items-center justify-between gap-20">
        <h2 id="price-chart-title" className="text-18">
          Price Chart
        </h2>
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
      </header>
      <ChartContent>{children}</ChartContent>
    </section>
  );
};

const ChartContent: FC<{ children: ReactNode }> = ({ children }) => {
  const { base, quote } = useTradeCtx();
  const priceChartType = config.ui?.priceChart ?? 'tradingView';
  if (priceChartType === 'tradingView') {
    return <TradingviewChart base={base} quote={quote} />;
  }
  return children;
};
