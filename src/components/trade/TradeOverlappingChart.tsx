import { useTradeCtx } from './TradeContext';
import { FC } from 'react';
import { TradingviewChart } from 'components/tradingviewChart';
import { useSearch } from '@tanstack/react-router';
import { OverlappingOrder } from 'components/strategies/common/types';
import { SetOverlapping } from 'libs/routing/routes/trade';
import { initSpread } from 'components/strategies/create/utils';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { NotFound } from 'components/common/NotFound';
import { OverlappingMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { OverlappingChart } from 'components/strategies/overlapping/OverlappingChart';

interface Props {
  marketPrice?: string;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
  set: SetOverlapping;
}

export const TradeOverlappingChart: FC<Props> = (props) => {
  const { base, quote } = useTradeCtx();
  const { marketPrice, order0, order1, set } = props;
  const { chartType, spread = initSpread } = useSearch({
    from: '/trade/overlapping',
  });

  const range = marketPrice ? (
    <OverlappingChart
      base={base}
      quote={quote}
      order0={order0}
      order1={order1}
      marketPrice={marketPrice}
      spread={spread}
      setMin={(min) => set('min', min)}
      setMax={(max) => set('max', max)}
    />
  ) : (
    <NotFound
      variant="info"
      title="Market Price Unavailable"
      text="Please provide a price."
    />
  );

  return (
    <section
      aria-labelledby="price-chart-title"
      className="bg-background-900 sticky top-[80px] flex max-h-[600px] min-h-[400px] flex-col gap-20 rounded p-20"
    >
      <header className="flex items-center justify-between gap-20">
        <h2 id="price-chart-title" className="text-18 flex-1">
          Price Chart
        </h2>
        <OverlappingMarketPrice
          base={base}
          quote={quote}
          marketPrice={marketPrice}
          setMarketPrice={(price) => set('marketPrice', price)}
        />
        <RadioGroup>
          <Radio
            checked={chartType !== 'history'}
            onChange={() => set('chartType', 'range')}
          >
            Range
          </Radio>
          <Radio
            checked={chartType === 'history'}
            onChange={() => set('chartType', 'history')}
          >
            History
          </Radio>
        </RadioGroup>
      </header>
      {chartType === 'history' ? (
        <TradingviewChart base={base} quote={quote} />
      ) : (
        range
      )}
    </section>
  );
};
