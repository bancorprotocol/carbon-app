import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { TradeSearch } from 'libs/routing';
import { FormOrder } from 'components/strategies/common/types';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import {
  defaultEnd,
  getBounds,
  oneYearAgo,
} from 'components/strategies/common/utils';
import { NotFound } from 'components/common/NotFound';
import { TradingviewChart } from 'components/tradingviewChart';
import { Token } from 'libs/tokens';
import { D3PriceHistory } from './d3Chart/D3PriceHistory';
import config from 'config';
import { useStrategyMarketPrice } from '../UserMarketPrice';
import { isEmptyHistory } from './d3Chart/utils';

interface Props {
  base: Token;
  quote: Token;
  // TODO: Provide Bounds directly instead of passing the orders
  buy?: FormOrder;
  sell?: FormOrder;
  direction?: 'buy' | 'sell'; // Only for disposable
  marketPrice?: string;
  children?: ReactNode;
}

export const StrategyChartHistory: FC<Props> = (props) => {
  const { base, quote, children, buy, sell } = props;
  const { chartStart, chartEnd } = useSearch({ strict: false }) as TradeSearch;
  const { marketPrice, isPending: isMarketPricePending } =
    useStrategyMarketPrice({ base, quote });

  const nav = useNavigate();

  const direction = props.direction;

  const [bounds, setBounds] = useState(
    getBounds(base, quote, buy, sell, direction),
  );

  const updatePriceRange = useCallback(
    (range: { start?: string; end?: string }) => {
      nav({
        to: '.',
        search: (s) => ({
          ...s,
          chartStart: range.start,
          chartEnd: range.end,
        }),
        resetScroll: false,
        replace: true,
      });
    },
    [nav],
  );

  const { data, isPending, isError } = useGetTokenPriceHistory({
    baseToken: base.address,
    quoteToken: quote.address,
    start: oneYearAgo(),
    end: defaultEnd(),
  });

  const history = useMemo(() => {
    if (!data || !marketPrice || isEmptyHistory(data)) return data;
    const copy = structuredClone(data);
    copy.at(-1)!.close = Number(marketPrice);
    return copy;
  }, [data, marketPrice]);

  useEffect(() => {
    setBounds(getBounds(base, quote, buy, sell, direction));
  }, [buy, sell, direction, base, quote]);

  const priceChartType = config.ui.priceChart;

  if (priceChartType === 'tradingView') {
    return <TradingviewChart base={base} quote={quote} />;
  }

  if (isPending || isMarketPricePending) {
    return (
      <section className="rounded-xl grid flex-1 items-center bg-black-gradient">
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
      data={history!}
      marketPrice={Number(marketPrice)}
      bounds={bounds}
      zoomBehavior="extended"
      start={chartStart}
      end={chartEnd}
      onRangeUpdates={updatePriceRange}
    >
      {children}
    </D3PriceHistory>
  );
};
