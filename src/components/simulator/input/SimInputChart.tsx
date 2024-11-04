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
import { useCallback } from 'react';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { CandlestickData } from 'libs/d3';
import { toUnixUTC } from '../utils';
import { formatNumber } from 'utils/helpers';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { D3PriceHistory } from 'components/strategies/common/d3Chart/D3PriceHistory';

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

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      dispatch('buyMin', formatNumber(buy.min), false);
      dispatch('buyMax', formatNumber(buy.max), false);
      dispatch('sellMin', formatNumber(sell.min), false);
      dispatch('sellMax', formatNumber(sell.max), false);
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
    (props: { start?: Date; end?: Date }) => {
      if (!props.start || !props.end) return;
      dispatch('start', toUnixUTC(props.start));
      dispatch('end', toUnixUTC(props.end));
    },
    [dispatch]
  );

  return (
    <div className="align-stretch top-120 rounded-12 bg-background-900 fixed right-20 grid h-[calc(100vh-220px)] min-h-[500px] w-[calc(100%-500px)] flex-1 grid-rows-[auto_1fr] justify-items-stretch p-20">
      <header
        data-testid="simulator-chart-header"
        className="mb-20 flex items-center justify-between"
      >
        <h2 className="text-20 font-weight-500 mr-20">Price Chart</h2>
      </header>
      {isError && (
        <ErrorMsg
          base={state.baseToken?.address}
          quote={state.quoteToken?.address}
        />
      )}

      {isPending && (
        <CarbonLogoLoading className="h-[100px] self-center justify-self-center" />
      )}

      {!!data && (
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
        />
      )}
    </div>
  );
};

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
