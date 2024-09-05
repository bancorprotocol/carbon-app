import { useTradeCtx } from './TradeContext';
import { FC, useCallback, useRef } from 'react';
import { useSearch } from '@tanstack/react-router';
import {
  OverlappingOrder,
  OverlappingSearch,
} from 'components/strategies/common/types';
import { SetOverlapping } from 'libs/routing/routes/trade';
import { initSpread } from 'components/strategies/create/utils';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { NotFound } from 'components/common/NotFound';
import { OverlappingMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { OverlappingChart } from 'components/strategies/overlapping/OverlappingChart';
import { StrategyChartHistory } from '../strategies/common/StrategyChartHistory';
import { OnPriceUpdates } from 'components/simulator/input/d3Chart';
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
import { useNavigate } from '@tanstack/react-router';
import { Token } from 'libs/tokens';

interface Props {
  marketPrice?: string;
  base: Token;
  quote: Token;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
  set: SetOverlapping;
}

const url = '/trade/overlapping';
export const TradeOverlappingChart: FC<Props> = (props) => {
  const { base, quote, marketPrice, set } = props;
  const search = useSearch({ strict: false }) as OverlappingSearch;
  const navigate = useNavigate({ from: url });

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
      className="bg-background-900 sticky top-[80px] flex max-h-[600px] min-h-[500px] flex-col gap-20 rounded p-20"
    >
      <header className="flex flex-wrap items-center gap-20">
        <h2 id="price-chart-title" className="text-18">
          Price Chart
        </h2>
        <RadioGroup className="mr-auto">
          <Radio
            name="chartType"
            checked={search.chartType !== 'history'}
            onChange={() => set({ chartType: 'range' })}
          >
            Range
          </Radio>
          <Radio
            name="chartType"
            checked={search.chartType === 'history'}
            onChange={() => set({ chartType: 'history' })}
          >
            History
          </Radio>
        </RadioGroup>
        <DateRangePicker
          defaultStart={defaultStartDate()}
          defaultEnd={defaultEndDate()}
          start={fromUnixUTC(search.priceStart)}
          end={fromUnixUTC(search.priceEnd)}
          onConfirm={onDatePickerConfirm}
          presets={datePickerPresets}
          options={{
            disabled: datePickerDisabledDays,
          }}
          required
        />
        <OverlappingMarketPrice
          base={base}
          quote={quote}
          marketPrice={marketPrice}
          setMarketPrice={(price) => set({ marketPrice: price })}
        />
      </header>
      <OverlappingChartContent {...props} />
    </section>
  );
};

const OverlappingChartContent: FC<Props> = (props) => {
  const timeout = useRef<NodeJS.Timeout>();
  const { base, quote } = useTradeCtx();
  const { marketPrice, order0, order1, set } = props;
  const search = useSearch({ strict: false }) as OverlappingSearch;

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        if (buy.min !== search.min) set({ min: buy.min });
        if (sell.max !== search.max) set({ max: sell.max });
      }, 200);
    },
    [set, search.min, search.max]
  );

  if (search.chartType !== 'history') {
    if (!marketPrice) {
      return (
        <NotFound
          variant="info"
          title="Market Price Unavailable"
          text="Please provide a price."
        />
      );
    }
    return (
      <OverlappingChart
        className="flex-1"
        base={base}
        quote={quote}
        order0={order0}
        order1={order1}
        userMarketPrice={search.marketPrice}
        spread={search.spread ?? initSpread}
        setMin={(min) => set({ min })}
        setMax={(max) => set({ max })}
      />
    );
  }
  return (
    <StrategyChartHistory
      type="overlapping"
      base={base}
      quote={quote}
      order0={order0}
      order1={order1}
      spread={search.spread || initSpread}
      onPriceUpdates={onPriceUpdates}
    />
  );
};
