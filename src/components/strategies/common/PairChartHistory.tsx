import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { TradeSearch } from 'libs/routing';
import { FC, ReactNode, useCallback } from 'react';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { defaultEnd, oneYearAgo } from 'components/strategies/common/utils';
import { NotFound } from 'components/common/NotFound';
import { TradingviewChart } from 'components/tradingviewChart';
import { Token } from 'libs/tokens';
import { D3PriceHistory } from './d3Chart/D3PriceHistory';
import config from 'config';

interface Props {
  base: Token;
  quote: Token;
  children?: ReactNode;
}

const bounds = {
  buy: { min: '', max: '' },
  sell: { min: '', max: '' },
};

export const PairChartHistory: FC<Props> = (props) => {
  const { base, quote, children } = props;
  const { chartStart, chartEnd } = useSearch({ strict: false }) as TradeSearch;
  const { marketPrice, isPending: marketIsPending } = useMarketPrice({
    base,
    quote,
  });
  const nav = useNavigate();

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

  const { data, isPending, isError } = useGetTokenPriceHistory({
    baseToken: base.address,
    quoteToken: quote.address,
    start: oneYearAgo(),
    end: defaultEnd(),
  });

  const priceChartType = config.ui.priceChart;

  if (priceChartType === 'tradingView') {
    return <TradingviewChart base={base} quote={quote} />;
  }

  if (isPending || marketIsPending) {
    return (
      <section className="rounded-xl grid flex-1 items-center bg-black/60">
        <CarbonLogoLoading className="h-[80px]" />
      </section>
    );
  }

  if (isError || !marketPrice) {
    return (
      <NotFound
        variant="info"
        title="Well, this doesn't happen often..."
        text="Unfortunately, price data for this pair is currently not available."
        className="min-h-0 flex-1 p-0"
      />
    );
  }

  return (
    <D3PriceHistory
      data={data}
      marketPrice={marketPrice}
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
