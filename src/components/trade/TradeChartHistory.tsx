import {
  ChartPrices,
  D3ChartCandlesticks,
  OnPriceUpdates,
} from 'components/simulator/input/d3Chart';
import { CandlestickData, D3ChartSettingsProps, D3ChartWrapper } from 'libs/d3';
import { useSearch } from '@tanstack/react-router';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { TradeSearch } from 'libs/routing';
import { FC, useEffect, useRef, useState } from 'react';
import { BaseOrder } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { useTradeCtx } from './TradeContext';
import { TradeTypes } from 'libs/routing/routes/trade';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { defaultEnd, defaultStart } from 'pages/simulator';
import { NotFound } from 'components/common/NotFound';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 0,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 0,
  marginRight: 80,
};

const getBounds = (
  order0: BaseOrder,
  order1: BaseOrder,
  data: CandlestickData[] = []
): ChartPrices => {
  const min = Math.min(...data.map((d) => d.low));
  const max = Math.max(...data.map((d) => d.high));
  return {
    buy: {
      min: order0.min || min.toString(),
      max: order0.max || max.toString(),
    },
    sell: {
      min: order1.min || min.toString(),
      max: order1.max || max.toString(),
    },
  };
};

interface Props {
  order0: BaseOrder;
  order1: BaseOrder;
  type: TradeTypes;
  isLimit?: { buy: boolean; sell: boolean };
  spread?: string;
  onPriceUpdates: OnPriceUpdates;
}

export const TradeChartHistory: FC<Props> = (props) => {
  const timeout = useRef<NodeJS.Timeout>();
  const { type, order0, order1, isLimit, spread } = props;
  const { base, quote } = useTradeCtx();
  const { priceStart, priceEnd } = useSearch({ strict: false }) as TradeSearch;
  const { marketPrice } = useMarketPrice({ base, quote });

  const [prices, setPrices] = useState({
    buy: { min: order0.min || '0', max: order0.max || '0' },
    sell: { min: order1.min || '0', max: order1.max || '0' },
  });

  useEffect(() => {
    setPrices({
      buy: { min: order0.min || '0', max: order0.max || '0' },
      sell: { min: order1.min || '0', max: order1.max || '0' },
    });
  }, [order0.min, order0.max, order1.min, order1.max]);

  const onPriceUpdates: OnPriceUpdates = ({ buy, sell }) => {
    setPrices({ buy, sell });
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      props.onPriceUpdates({ buy, sell });
    }, 200);
  };

  const { data, isPending, isError } = useGetTokenPriceHistory({
    baseToken: base.address,
    quoteToken: quote.address,
    start: priceStart ?? defaultStart().toString(),
    end: priceEnd ?? defaultEnd().toString(),
  });

  const bounds: ChartPrices = getBounds(order0, order1, data);

  if (isPending) {
    return (
      <section className="rounded-12 grid flex-1 items-center bg-black">
        <CarbonLogoLoading className="h-[80px]" />
      </section>
    );
  }
  if (isError) {
    return (
      <NotFound
        variant="error"
        title="Well, this doesn't happen often..."
        text="Unfortunately, price history for this pair is not available."
      />
    );
  }
  if (!data) return null;
  return (
    <D3ChartWrapper
      settings={chartSettings}
      className="rounded-12 flex-1 bg-black"
      data-testid="price-chart"
    >
      {(dms) => (
        <D3ChartCandlesticks
          dms={dms}
          prices={prices}
          onPriceUpdates={onPriceUpdates}
          data={data}
          marketPrice={marketPrice}
          bounds={bounds}
          onDragEnd={onPriceUpdates}
          isLimit={isLimit}
          type={type}
          overlappingSpread={spread}
          overlappingMarketPrice={marketPrice}
        />
      )}
    </D3ChartWrapper>
  );
};
