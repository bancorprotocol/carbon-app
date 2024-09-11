import {
  ChartPrices,
  D3ChartCandlesticks,
  OnPriceUpdates,
} from 'components/strategies/common/d3Chart';
import { CandlestickData, D3ChartSettingsProps, D3ChartWrapper } from 'libs/d3';
import { useSearch } from '@tanstack/react-router';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { TradeSearch } from 'libs/routing';
import { FC, useEffect, useRef, useState } from 'react';
import { BaseOrder } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TradeTypes } from 'libs/routing/routes/trade';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { defaultEnd, defaultStart } from 'components/strategies/common/utils';
import { NotFound } from 'components/common/NotFound';
import { TradingviewChart } from 'components/tradingviewChart';
import { Token } from 'libs/tokens';
import config from 'config';

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
  data: CandlestickData[] = [],
  direction?: 'none' | 'buy' | 'sell'
): ChartPrices => {
  const min = Math.min(...data.map((d) => d.low)).toString();
  const max = Math.max(...data.map((d) => d.high)).toString();
  if (direction === 'none') {
    return {
      buy: { min, max },
      sell: { min, max },
    };
  } else if (direction === 'buy') {
    return {
      buy: {
        min: order0.min || '0',
        max: order0.max || max,
      },
      sell: {
        min: min,
        max: max,
      },
    };
  } else if (direction === 'sell') {
    return {
      buy: {
        min: min,
        max: max,
      },
      sell: {
        min: order1.min || '0',
        max: order1.max || max,
      },
    };
  } else {
    return {
      buy: {
        min: order0.min || min,
        max: order0.max || max,
      },
      sell: {
        min: order1.min || min,
        max: order1.max || max,
      },
    };
  }
};

interface Props {
  type: TradeTypes;
  base: Token;
  quote: Token;
  order0: BaseOrder;
  order1: BaseOrder;
  isLimit?: { buy: boolean; sell: boolean };
  direction?: 'buy' | 'sell'; // Only for disposable
  spread?: string; // Only overlapping
  readonly?: boolean;
  marketPrice?: string;
  onPriceUpdates?: OnPriceUpdates;
}

export const StrategyChartHistory: FC<Props> = (props) => {
  const timeout = useRef<NodeJS.Timeout>();
  const { base, quote, type, order0, order1 } = props;
  const { priceStart, priceEnd } = useSearch({ strict: false }) as TradeSearch;
  const { marketPrice: externalPrice } = useMarketPrice({ base, quote });

  const marketPrice = props.marketPrice
    ? Number(props.marketPrice)
    : externalPrice;

  const direction = (() => {
    if (type === 'market') return 'none';
    return props.direction;
  })();

  const [prices, setPrices] = useState({
    buy: { min: order0.min || '0', max: order0.max || '0' },
    sell: { min: order1.min || '0', max: order1.max || '0' },
  });
  const [bounds, setBounds] = useState(
    getBounds(order0, order1, [], direction)
  );

  const updatePrices: OnPriceUpdates = ({ buy, sell }) => {
    setPrices({ buy, sell });
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      props.onPriceUpdates?.({ buy, sell });
    }, 200);
  };

  const { data, isPending, isError } = useGetTokenPriceHistory({
    baseToken: base.address,
    quoteToken: quote.address,
    start: priceStart ?? defaultStart().toString(),
    end: priceEnd ?? defaultEnd().toString(),
  });

  useEffect(() => {
    setPrices({
      buy: { min: order0.min || '0', max: order0.max || '0' },
      sell: { min: order1.min || '0', max: order1.max || '0' },
    });
  }, [order0.min, order0.max, order1.min, order1.max]);

  useEffect(() => {
    setBounds(getBounds(order0, order1, data, direction));
  }, [order0, order1, data, direction]);

  const priceChartType = config.ui.priceChart;
  if (priceChartType === 'tradingView') {
    return <TradingviewChart base={base} quote={quote} />;
  }
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
        className="min-h-0 flex-1"
      />
    );
  }
  if (!data?.length) return null;
  return (
    <D3ChartWrapper
      settings={chartSettings}
      className="rounded-12 flex-1 bg-black"
      data-testid="price-chart"
    >
      {(dms) => (
        <D3ChartCandlesticks
          readonly={props.readonly}
          dms={dms}
          prices={prices}
          onPriceUpdates={updatePrices}
          data={data}
          marketPrice={marketPrice}
          bounds={bounds}
          onDragEnd={updatePrices}
          isLimit={props.isLimit}
          type={type}
          overlappingSpread={props.spread}
          overlappingMarketPrice={marketPrice}
        />
      )}
    </D3ChartWrapper>
  );
};
