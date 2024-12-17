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
import { StrategyChartHistory } from './StrategyChartHistory';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { Token } from 'libs/tokens';
import { StrategyChartLegend } from './StrategyChartLegend';

interface Props {
  marketPrice?: string;
  base: Token;
  quote: Token;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
  readonly?: boolean;
  set: SetOverlapping;
}

export const StrategyChartOverlapping: FC<Props> = (props) => {
  const { base, quote, marketPrice, set } = props;
  const search = useSearch({ strict: false }) as OverlappingSearch;
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
  const timeout = useRef<NodeJS.Timeout>(null);
  const { base, quote, marketPrice, order0, order1, readonly, set } = props;
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
        disabled={readonly}
      />
    );
  }
  return (
    <>
      <StrategyChartHistory
        type="overlapping"
        base={base}
        quote={quote}
        order0={order0}
        order1={order1}
        spread={search.spread || initSpread}
        marketPrice={search.marketPrice}
        readonly={readonly}
        onPriceUpdates={onPriceUpdates}
      />
      {readonly && <StrategyChartLegend />}
    </>
  );
};
