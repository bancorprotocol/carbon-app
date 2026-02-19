import { Link } from '@tanstack/react-router';

import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import {
  SimulatorInputOverlappingValues,
  SimulatorOverlappingInputDispatch,
} from 'hooks/useSimulatorOverlappingInput';
import { StrategyInputValues } from 'hooks/useStrategyInput';
import { ChartPrices } from 'components/strategies/common/d3Chart';
import { ReactNode, useCallback } from 'react';
import IconQuestion from 'assets/icons/question.svg?react';
import { CandlestickData } from 'libs/d3';
import { D3PriceHistory } from 'components/strategies/common/d3Chart/D3PriceHistory';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { D3Drawings } from 'components/strategies/common/d3Chart/drawing/D3Drawings';
import { D3XAxis } from 'components/strategies/common/d3Chart/D3XAxis';
import { D3YAxis } from 'components/strategies/common/d3Chart/D3YAxis';
import { D3ChartMarketPrice } from 'components/strategies/common/d3Chart/D3ChartMarketPrice';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';
import { NotFound } from 'components/common/NotFound';

interface Props {
  state: StrategyInputValues | SimulatorInputOverlappingValues;
  dispatch: SimulatorOverlappingInputDispatch;
  bounds: ChartPrices;
  data?: CandlestickData[];
  isPending: boolean;
  isError: boolean;
  prices: ChartPrices;
  children: ReactNode;
}

export const SimInputChart = ({
  state,
  dispatch,
  bounds,
  isPending,
  isError,
  data,
  prices,
  children,
}: Props) => {
  const { marketPrice, isPending: marketIsPending } = useMarketPrice({
    base: state.base,
    quote: state.quote,
  });

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
        <ErrorMsg base={state.base?.address} quote={state.quote?.address} />
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
        onRangeUpdates={onDatePickerConfirm}
        data={data}
        marketPrice={marketPrice}
        bounds={bounds}
        zoomBehavior="normal"
        start={state.start}
        end={state.end}
      >
        {children}
        <D3Drawings />
        <D3XAxis />
        <D3YAxis />
        <D3ChartMarketPrice marketPrice={marketPrice} />
        <D3PricesAxis prices={prices} />
      </D3PriceHistory>
    </Layout>
  );
};

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="surface sticky top-[96px] grid h-[600px] grid-rows-[auto_1fr] gap-20 rounded-2xl p-20 grid-area-[chart] animate-scale-up">
    <header className="flex items-center justify-between">
      <h2 className="text-20 font-medium">Price Chart</h2>
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
      <p className="text-14 font-normal text-center text-main-0/60">
        Unfortunately, price data for this pair is currently unavailable, so
        simulation isn't possible. However, you can still go ahead and create a
        strategy.
      </p>
      <Link to="/trade" search={{ base, quote }} className="btn-main-gradient">
        Create
      </Link>
    </div>
  );
};
