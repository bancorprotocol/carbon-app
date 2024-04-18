import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import {
  DateRangePicker,
  datePickerPresets,
} from 'components/common/datePicker/DateRangePicker';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { datePickerDisabledDays } from 'components/simulator/result/SimResultChartHeader';
import {
  SimulatorInputOverlappingValues,
  SimulatorOverlappingInputDispatch,
} from 'hooks/useSimulatorOverlappingInput';
import { StrategyInputValues } from 'hooks/useStrategyInput';
import {
  ChartPrices,
  D3ChartCandlesticks,
  OnPriceUpdates,
} from 'components/simulator/input/d3Chart';
import { useCompareTokenPrice } from 'libs/queries/extApi/tokenPrice';
import { SimulatorType } from 'libs/routing/routes/sim';
import { useCallback } from 'react';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { CandlestickData, D3ChartSettingsProps, D3ChartWrapper } from 'libs/d3';
import { fromUnixUTC, toUnixUTC } from '../utils';
import { useStore } from 'store';
import { startOfDay, sub } from 'date-fns';

interface Props {
  state: StrategyInputValues | SimulatorInputOverlappingValues;
  dispatch: SimulatorOverlappingInputDispatch;
  isLimit?: { buy: boolean; sell: boolean };
  spread?: string;
  bounds: ChartPrices;
  data?: CandlestickData[];
  isLoading: boolean;
  isError: boolean;
  simulationType: SimulatorType;
}

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 0,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 0,
  marginRight: 80,
};

export const SimInputChart = ({
  state,
  dispatch,
  isLimit,
  spread,
  bounds,
  isLoading,
  isError,
  data,
  simulationType,
}: Props) => {
  const { debug } = useStore();
  const marketPrice = useCompareTokenPrice(
    state.baseToken?.address,
    state.quoteToken?.address
  );

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
      dispatch('buyMin', buy.min, false);
      dispatch('buyMax', buy.max, false);
      dispatch('sellMin', sell.min, false);
      dispatch('sellMax', sell.max, false);
    },
    [dispatch]
  );

  const onPriceUpdatesEnd: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      dispatch('buyMin', buy.min);
      dispatch('buyMax', buy.max);
      dispatch('sellMin', sell.min);
      dispatch('sellMax', sell.max);
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
      <div className="mb-20 flex items-center justify-between">
        <h2 className="text-20 font-weight-500 mr-20">Price Chart</h2>
        <DateRangePicker
          defaultStart={startOfDay(sub(new Date(), { days: 364 }))}
          defaultEnd={startOfDay(new Date())}
          start={fromUnixUTC(state.start)}
          end={fromUnixUTC(state.end)}
          onConfirm={onDatePickerConfirm}
          presets={datePickerPresets}
          options={{
            disabled: debug.debugState.isE2E ? [] : datePickerDisabledDays,
          }}
          required
        />
      </div>
      {isError && (
        <ErrorMsg
          base={state.baseToken?.address}
          quote={state.quoteToken?.address}
        />
      )}

      {isLoading && (
        <CarbonLogoLoading className="h-[100px] self-center justify-self-center" />
      )}

      {!!data && (
        <D3ChartWrapper
          settings={chartSettings}
          className="rounded-12 self-stretch bg-black"
          data-testid="price-chart"
        >
          {(dms) => (
            <D3ChartCandlesticks
              dms={dms}
              prices={prices}
              onPriceUpdates={onPriceUpdates}
              data={data}
              marketPrice={marketPrice}
              bounds={bounds}
              onDragEnd={onPriceUpdatesEnd}
              isLimit={isLimit}
              type={simulationType}
              overlappingSpread={spread}
            />
          )}
        </D3ChartWrapper>
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
        to="/strategies/create"
        search={{ base, quote }}
        className={buttonStyles({ variant: 'success' })}
      >
        Create Strategy
      </Link>
    </div>
  );
};
