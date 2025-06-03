import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import {
  SimulatorInputOverlappingValues,
  SimulatorOverlappingInputDispatch,
} from 'hooks/useSimulatorOverlappingInput';
import { StrategyInputValues } from 'hooks/useStrategyInput';
import {
  ChartPrices,
  OnPriceUpdates,
} from 'components/strategies/common/d3Chart';
import { SimulatorType } from 'libs/routing/routes/sim';
import { ReactNode, useCallback } from 'react';
import { ReactComponent as IconQuestion } from 'assets/icons/question.svg';
import { CandlestickData } from 'libs/d3';
import { formatNumber } from 'utils/helpers';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { D3PriceHistory } from 'components/strategies/common/d3Chart/D3PriceHistory';
import { isFullRange } from 'components/strategies/common/utils';
import { NotFound } from 'components/common/NotFound';

interface Props {
  state: StrategyInputValues | SimulatorInputOverlappingValues;
  dispatch: SimulatorOverlappingInputDispatch;
  isLimit?: { buy: boolean; sell: boolean };
  spread?: string;
  bounds: ChartPrices;
  data?: CandlestickData[];
  isPending: boolean;
  isError: boolean;
  simulationType: SimulatorType;
}

export const SimInputChart = ({
  state,
  dispatch,
  isLimit,
  spread,
  bounds,
  isPending,
  isError,
  data,
  simulationType,
}: Props) => {
  const { marketPrice, isPending: marketIsPending } = useMarketPrice({
    base: state.baseToken,
    quote: state.quoteToken,
  });

  const prices = {
    buy: {
      min: state.buy.min,
      max: state.buy.max,
    },
    sell: {
      min: state.sell.min,
      max: state.sell.max,
    },
  };

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      dispatch('buyMin', formatNumber(buy.min));
      dispatch('buyMax', formatNumber(buy.max));
      dispatch('sellMin', formatNumber(sell.min));
      dispatch('sellMax', formatNumber(sell.max));
    },
    [dispatch],
  );

  const onPriceUpdatesEnd: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      dispatch('buyMin', formatNumber(buy.min));
      dispatch('buyMax', formatNumber(buy.max));
      dispatch('sellMin', formatNumber(sell.min));
      dispatch('sellMax', formatNumber(sell.max));
    },
    [dispatch],
  );

  const onDatePickerConfirm = useCallback(
    (props: { start?: string; end?: string }) => {
      if (!props.start || !props.end) return;
      dispatch('start', props.start);
      dispatch('end', props.end);
    },
    [dispatch],
  );

  if (isPending || marketIsPending) {
    return (
      <Layout>
        <CarbonLogoLoading className="h-[80px] self-center justify-self-center" />
      </Layout>
    );
  }
  if (isError || !data) {
    return (
      <Layout>
        <ErrorMsg
          base={state.baseToken?.address}
          quote={state.quoteToken?.address}
        />
      </Layout>
    );
  }
  if (!marketPrice) {
    return (
      <Layout>
        <NotFound
          variant="info"
          title="Market Price Unavailable"
          text="Please provide a price."
        />
      </Layout>
    );
  }
  return (
    <Layout>
      <D3PriceHistory
        className="self-stretch"
        prices={prices}
        onPriceUpdates={onPriceUpdates}
        onDragEnd={onPriceUpdatesEnd}
        onRangeUpdates={onDatePickerConfirm}
        data={data}
        marketPrice={marketPrice}
        bounds={bounds}
        isLimit={isLimit}
        type={simulationType}
        overlappingSpread={spread}
        zoomBehavior="normal"
        start={state.start}
        end={state.end}
        readonly={isFullRange(prices.buy.min, prices.sell.max)}
      />
    </Layout>
  );
};

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="bg-background-900 sticky top-[80px] grid h-[600px] grid-rows-[auto_1fr] gap-20 rounded p-20">
    <header className="flex items-center justify-between">
      <h2 className="text-20 font-weight-500">Price Chart</h2>
    </header>
    {children}
  </div>
);

const ErrorMsg = ({ base, quote }: { base?: string; quote?: string }) => {
  return (
    <div className="grid max-w-[340px] gap-20 place-self-center">
      <div className="size-75 text-primary bg-primary/25 grid place-items-center justify-self-center rounded-full">
        <IconQuestion className="size-48" />
      </div>
      <h2 className="text-center">Well, this doesn't happen often...</h2>
      <p className="text-14 font-weight-400 text-center text-white/60">
        Unfortunately, price data for this pair is currently unavailable, so
        simulation isn't possible. However, you can still go ahead and create a
        strategy.
      </p>
      <Link
        to="/trade"
        search={{ base, quote }}
        className={buttonStyles({ variant: 'success' })}
      >
        Create
      </Link>
    </div>
  );
};
