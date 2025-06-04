import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { TradeSearch } from 'libs/routing';
import { FC, useCallback } from 'react';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { defaultEnd, oneYearAgo } from 'components/strategies/common/utils';
import { NotFound } from 'components/common/NotFound';
import { TradingviewChart } from 'components/tradingviewChart';
import { Token } from 'libs/tokens';
import { Activity } from 'libs/queries/extApi/activity';
import { D3PriceHistory } from './d3Chart/D3PriceHistory';
import config from 'config';

interface Props {
  base: Token;
  quote: Token;
  readonly?: boolean;
  activities?: Activity[];
}

const bounds = {
  buy: { min: '', max: '' },
  sell: { min: '', max: '' },
};

const prices = {
  buy: { min: '0', max: '0' },
  sell: { min: '0', max: '0' },
};

export const PairChartHistory: FC<Props> = (props) => {
  const { base, quote, activities } = props;
  const { priceStart, priceEnd } = useSearch({ strict: false }) as TradeSearch;
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
      <section className="rounded-12 grid flex-1 items-center bg-black">
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
      type="market"
      readonly={props.readonly}
      prices={prices}
      data={data}
      marketPrice={marketPrice}
      bounds={bounds}
      activities={activities}
      zoomBehavior={activities ? 'normal' : 'extended'}
      start={priceStart}
      end={priceEnd}
      onRangeUpdates={updatePriceRange}
    />
  );
};
