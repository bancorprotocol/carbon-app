import { FC, useCallback, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import {
  CreateOverlappingOrder,
  OverlappingSearch,
} from 'components/strategies/common/types';
import { SetOverlapping } from 'libs/routing/routes/trade';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { OverlappingChart } from 'components/strategies/overlapping/OverlappingChart';
import { StrategyChartHistory } from './StrategyChartHistory';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { Token } from 'libs/tokens';
import { StrategyChartLegend } from './StrategyChartLegend';
import { useDebouncePrices } from './d3Chart/useDebouncePrices';
import { D3ChartOverlapping } from './d3Chart/overlapping/D3ChartOverlapping';
import { TradeChartContent } from './d3Chart/TradeChartContent';
import { D3PricesAxis } from './d3Chart/D3PriceAxis';
import { defaultSpread } from '../overlapping/utils';
import { isFullRangeStrategy } from './utils';

interface Props {
  base: Token;
  quote: Token;
  buy: CreateOverlappingOrder;
  sell: CreateOverlappingOrder;
  readonly?: boolean;
  set: SetOverlapping;
}

export const StrategyChartOverlapping: FC<Props> = (props) => {
  const { base, quote, set } = props;
  const search = useSearch({ strict: false }) as OverlappingSearch;

  return (
    <section
      aria-labelledby="price-chart-title"
      className="bg-white-gradient sticky top-[80px] sm:flex max-h-[600px] min-h-[500px] flex-col gap-20 rounded-2xl p-20 animate-scale-up hidden"
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

        <EditMarketPrice base={base} quote={quote} />
      </header>
      <OverlappingChartContent {...props} />
    </section>
  );
};

const OverlappingChartContent: FC<Props> = (props) => {
  const { base, quote, buy, sell, set } = props;
  const search = useSearch({ strict: false }) as OverlappingSearch;

  const fullRange = useMemo(() => {
    return isFullRangeStrategy(buy, sell);
  }, [buy, sell]);

  const readonly = props.readonly || fullRange;

  const updatePrices: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      if (buy.min !== search.min) set({ min: buy.min });
      if (sell.max !== search.max) set({ max: sell.max });
    },
    [search.max, search.min, set],
  );

  const { prices, setPrices } = useDebouncePrices(buy, sell, updatePrices);

  if (search.chartType !== 'history') {
    return (
      <OverlappingChart
        className="flex-1"
        base={base}
        quote={quote}
        buy={buy}
        sell={sell}
        userMarketPrice={search.marketPrice}
        spread={search.spread}
        setMin={(min) => set({ min })}
        setMax={(max) => set({ max })}
        disabled={readonly || fullRange}
      />
    );
  }
  return (
    <>
      <StrategyChartHistory
        base={base}
        quote={quote}
        buy={buy}
        sell={sell}
        marketPrice={search.marketPrice}
      >
        <D3ChartOverlapping
          prices={prices}
          onChange={readonly ? undefined : setPrices}
          spread={Number(search.spread || defaultSpread)}
        />
        <TradeChartContent />
        <D3PricesAxis prices={prices} />
      </StrategyChartHistory>
      {props.readonly && <StrategyChartLegend />}
    </>
  );
};
