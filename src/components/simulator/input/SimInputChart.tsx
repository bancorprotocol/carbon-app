import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { SimulatorInputDispatch } from 'hooks/useSimulatorInput';
import { StrategyInputValues } from 'hooks/useStrategyInput';
import { D3ChartSettingsProps, useChartDimensions } from 'libs/d3';
import {
  ChartPrices,
  D3ChartCandlesticks,
  OnPriceUpdates,
} from 'components/simulator/input/d3Chart';
import {
  useCompareTokenPrice,
  useGetTokenPriceHistory,
} from 'libs/queries/extApi/tokenPrice';
import { StrategyDirection } from 'libs/routing';
import { SafeDecimal } from 'libs/safedecimal';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { cn } from 'utils/helpers';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 750,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 0,
  marginRight: 80,
};

interface Props {
  timeRange: { start: number; end: number };
  state: StrategyInputValues;
  dispatch: SimulatorInputDispatch;
  initBuyRange: boolean;
  initSellRange: boolean;
  setInitBuyRange: Dispatch<SetStateAction<boolean>>;
  setInitSellRange: Dispatch<SetStateAction<boolean>>;
  bounds: ChartPrices;
}

export const SimInputChart = ({
  timeRange,
  state,
  dispatch,
  initBuyRange,
  initSellRange,
  setInitBuyRange,
  setInitSellRange,
  bounds,
}: Props) => {
  const [ref, dms] = useChartDimensions(chartSettings);

  const marketPrice = useCompareTokenPrice(
    state.baseToken?.address,
    state.quoteToken?.address
  );

  const { data, isLoading, isError } = useGetTokenPriceHistory({
    baseToken: state.baseToken?.address,
    quoteToken: state.quoteToken?.address,
    start: timeRange.start,
    end: timeRange.end,
  });

  const handleDefaultValues = useCallback(
    (type: StrategyDirection) => {
      const init = type === 'buy' ? initBuyRange : initSellRange;
      const setInit = type === 'buy' ? setInitBuyRange : setInitSellRange;

      if (!marketPrice || !init) return;
      setInit(false);

      if (!(!state[type].max && !state[type].min)) {
        return;
      }

      const operation = type === 'buy' ? 'minus' : 'plus';

      const multiplierMax = type === 'buy' ? 0.1 : 0.2;
      const multiplierMin = type === 'buy' ? 0.2 : 0.1;

      const max = new SafeDecimal(marketPrice)
        [operation](marketPrice * multiplierMax)
        .toFixed();

      const min = new SafeDecimal(marketPrice)
        [operation](marketPrice * multiplierMin)
        .toFixed();

      if (state[type].isRange) {
        dispatch(`${type}Max`, max);
        dispatch(`${type}Min`, min);
      } else {
        const value = type === 'buy' ? max : min;
        dispatch(`${type}Max`, value);
        dispatch(`${type}Min`, value);
      }
    },
    [
      dispatch,
      initBuyRange,
      initSellRange,
      marketPrice,
      setInitBuyRange,
      setInitSellRange,
      state,
    ]
  );

  useEffect(() => {
    handleDefaultValues('buy');
    handleDefaultValues('sell');
  }, [handleDefaultValues]);

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

  return (
    <div className="absolute right-[20px] w-[calc(100%-500px)]">
      <div ref={ref} className="sticky top-50 rounded-12 bg-silver p-20">
        <h2 className="mb-20 text-20 font-weight-500">Price Chart</h2>
        <div
          className={cn(
            'flex items-center justify-center overflow-hidden rounded-12 bg-black'
          )}
          style={{ height: dms.height }}
        >
          {isError && (
            <ErrorMsg
              base={state.baseToken?.address}
              quote={state.quoteToken?.address}
            />
          )}

          {isLoading && <CarbonLogoLoading className="h-[100px]" />}

          {!!data && (
            <D3ChartCandlesticks
              prices={prices}
              onPriceUpdates={onPriceUpdates}
              data={data}
              dms={dms}
              marketPrice={marketPrice}
              bounds={bounds}
              onDragEnd={onPriceUpdatesEnd}
              isLimit={{
                buy: !state.buy.isRange,
                sell: !state.sell.isRange,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ErrorMsg = ({ base, quote }: { base?: string; quote?: string }) => {
  return (
    <div className="max-w-[340px]">
      <IconTitleText
        icon={<IconWarning />}
        title="Well, this doesn’t happen often..."
        text="Unfortunately, price history for this token is not available and cannot be simulated."
        variant="error"
      />
      <p className="my-20 text-center text-14 text-white/60">
        However, you can{' '}
        <span className="font-weight-500 text-white">Create a Strategy</span>
      </p>

      <Link
        to={'/strategies/create'}
        search={{ base, quote }}
        className={buttonStyles({ variant: 'success' })}
      >
        Create Strategy
      </Link>
    </div>
  );
};
