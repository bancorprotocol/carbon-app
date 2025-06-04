import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { TradeSearch } from 'libs/routing';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { BaseOrder } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TradeTypes } from 'libs/routing/routes/trade';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import {
  defaultEnd,
  getBounds,
  oneYearAgo,
} from 'components/strategies/common/utils';
import { NotFound } from 'components/common/NotFound';
import { TradingviewChart } from 'components/tradingviewChart';
import { Token } from 'libs/tokens';
import { Activity } from 'libs/queries/extApi/activity';
import { SafeDecimal } from 'libs/safedecimal';
import { D3PriceHistory } from './d3Chart/D3PriceHistory';
import config from 'config';

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
  activities?: Activity[];
  onPriceUpdates?: OnPriceUpdates;
}

export const StrategyChartHistory: FC<Props> = (props) => {
  const timeout = useRef<NodeJS.Timeout>(null);
  const { base, quote, type, order0, order1, activities, onPriceUpdates } =
    props;
  const { priceStart, priceEnd } = useSearch({ strict: false }) as TradeSearch;
  const search = useSearch({ strict: false });
  const { marketPrice: externalPrice } = useMarketPrice({ base, quote });
  const nav = useNavigate();

  const marketPrice = search.marketPrice
    ? Number(search.marketPrice)
    : externalPrice;

  const direction = (() => {
    if (type === 'market') return 'none';
    return props.direction;
  })();

  const [prices, setPrices] = useState({
    buy: { min: order0.min || '0', max: order0.max || '0' },
    sell: { min: order1.min || '0', max: order1.max || '0' },
  });
  const [bounds, setBounds] = useState(getBounds(order0, order1, direction));

  const updatePriceRange = useCallback(
    (range: { start?: string; end?: string }) => {
      nav({
        to: '.',
        search: (s) => ({
          ...s,
          priceStart: range.start,
          priceEnd: range.end,
        }),
        resetScroll: false,
        replace: true,
      });
    },
    [nav],
  );

  const updatePrices: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      const newPrices = {
        buy: {
          min: SafeDecimal.max(buy.min, 0).toString(),
          max: SafeDecimal.max(buy.max, 0).toString(),
        },
        sell: {
          min: SafeDecimal.max(sell.min, 0).toString(),
          max: SafeDecimal.max(sell.max, 0).toString(),
        },
      };
      setPrices(newPrices);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        onPriceUpdates?.(newPrices);
      }, 200);
    },
    [onPriceUpdates],
  );

  const { data, isPending, isError } = useGetTokenPriceHistory({
    baseToken: base.address,
    quoteToken: quote.address,
    start: oneYearAgo(),
    end: defaultEnd(),
  });

  useEffect(() => {
    setPrices({
      buy: { min: order0.min || '0', max: order0.max || '0' },
      sell: { min: order1.min || '0', max: order1.max || '0' },
    });
  }, [order0.min, order0.max, order1.min, order1.max]);

  useEffect(() => {
    setBounds(getBounds(order0, order1, direction));
  }, [order0, order1, direction]);

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
        variant="info"
        title="Well, this doesn't happen often..."
        text="Unfortunately, price history for this pair is not available."
        className="min-h-0 flex-1"
      />
    );
  }

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
    <D3PriceHistory
      readonly={props.readonly}
      prices={prices}
      onPriceUpdates={updatePrices}
      onDragEnd={updatePrices}
      data={data}
      marketPrice={marketPrice}
      bounds={bounds}
      isLimit={props.isLimit}
      type={type}
      overlappingSpread={props.spread}
      activities={activities}
      zoomBehavior={activities ? 'normal' : 'extended'}
      start={priceStart}
      end={priceEnd}
      onRangeUpdates={updatePriceRange}
    />
  );
};
