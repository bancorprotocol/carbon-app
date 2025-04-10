import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
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
import { ReactNode, useCallback, useMemo } from 'react';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { CandlestickData } from 'libs/d3';
import { formatNumber } from 'utils/helpers';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { D3PriceHistory } from 'components/strategies/common/d3Chart/D3PriceHistory';
import { isFullRange } from 'components/strategies/common/utils';
import { isEmptyHistory } from 'components/strategies/common/d3Chart/utils';
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
  const { marketPrice } = useMarketPrice({
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

  const emptyHistory = useMemo(() => isEmptyHistory(data), [data]);

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      dispatch('buyMin', formatNumber(buy.min));
      dispatch('buyMax', formatNumber(buy.max));
      dispatch('sellMin', formatNumber(sell.min));
      dispatch('sellMax', formatNumber(sell.max));
    },
    [dispatch]
  );

  const onPriceUpdatesEnd: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      dispatch('buyMin', formatNumber(buy.min));
      dispatch('buyMax', formatNumber(buy.max));
      dispatch('sellMin', formatNumber(sell.min));
      dispatch('sellMax', formatNumber(sell.max));
    },
    [dispatch]
  );

  const onDatePickerConfirm = useCallback(
    (props: { start?: string; end?: string }) => {
      if (!props.start || !props.end) return;
      dispatch('start', props.start);
      dispatch('end', props.end);
    },
    [dispatch]
  );

  if (isError) {
    return (
      <Layout>
        <ErrorMsg
          base={state.baseToken?.address}
          quote={state.quoteToken?.address}
        />
      </Layout>
    );
  }
  if (isPending || !data) {
    return (
      <Layout>
        <CarbonLogoLoading className="h-[80px] self-center justify-self-center" />
      </Layout>
    );
  }
  if (emptyHistory && !marketPrice) {
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
  <div className="bg-background-900 sticky top-[80px] flex h-[600px] flex-col gap-20 rounded p-20">
    <header className="mb-20 flex items-center justify-between">
      <h2 className="text-20 font-weight-500 mr-20">Price Chart</h2>
    </header>
    {children}
  </div>
);

const ErrorMsg = ({ base, quote }: { base?: string; quote?: string }) => {
  return (
    <div className="max-w-[340px] self-center justify-self-center">
      <IconTitleText
        icon={<IconPlus />}
        title="Well, this doesn’t happen often..."
        text="Unfortunately, price history for this pair is not available and cannot be simulated."
        variant="success"
      />
      <p className="text-14 my-20 text-center text-white/60">
        However, you can{' '}
        <span className="font-weight-500 text-white">Create a Strategy</span>
      </p>

      <Link
        to="/trade/disposable"
        search={{ base, quote }}
        className={buttonStyles({ variant: 'success' })}
      >
        Create Strategy
      </Link>
    </div>
  );
};
