import {
  ChartPrices,
  OnPriceUpdates,
} from 'components/strategies/common/d3Chart';
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
import { Activity } from 'libs/queries/extApi/activity';
import { SafeDecimal } from 'libs/safedecimal';
import { D3PriceHistory } from './d3Chart/D3PriceHistory';
import config from 'config';

const getBounds = (
  order0: BaseOrder,
  order1: BaseOrder,
  direction?: 'none' | 'buy' | 'sell'
): ChartPrices => {
  if (direction === 'none') {
    return {
      buy: { min: '', max: '' },
      sell: { min: '', max: '' },
    };
  } else if (direction === 'buy') {
    return {
      buy: { min: order0.min, max: order0.max },
      sell: { min: '', max: '' },
    };
  } else if (direction === 'sell') {
    return {
      buy: { min: '', max: '' },
      sell: { min: order1.min, max: order1.max },
    };
  } else {
    return {
      buy: { min: order0.min, max: order0.max },
      sell: { min: order1.min, max: order1.max },
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
  activities?: Activity[];
  onPriceUpdates?: OnPriceUpdates;
}

export const StrategyChartHistory: FC<Props> = (props) => {
  const timeout = useRef<NodeJS.Timeout>();
  const { base, quote, type, order0, order1, activities } = props;
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
  const [bounds, setBounds] = useState(getBounds(order0, order1, direction));

  const updatePrices: OnPriceUpdates = ({ buy, sell }) => {
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
      props.onPriceUpdates?.(newPrices);
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
        variant="error"
        title="Well, this doesn't happen often..."
        text="Unfortunately, price history for this pair is not available."
        className="min-h-0 flex-1"
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
    />
  );
};
