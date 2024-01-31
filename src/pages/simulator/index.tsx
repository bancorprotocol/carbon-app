import { Link } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { BuySellBlock } from 'components/simulator/BuySellBlockNew';
import { SimulatorStrategyType } from 'components/simulator/SimulatorStrategyType';
import { SimulatorTokenSelection } from 'components/simulator/SimulatorTokenSelection';
import { checkIfOrdersOverlapNew } from 'components/strategies/utils';
import dayjs from 'dayjs';
import { useStrategyInput } from 'hooks/useStrategyInput';
import { D3ChartSettingsProps, useChartDimensions } from 'libs/d3';
import { D3ChartCandlesticks } from 'libs/d3/charts/candlestick/D3ChartCandlesticks';
import {
  useCompareTokenPrice,
  useGetTokenPriceHistory,
} from 'libs/queries/extApi/tokenPrice';
import { StrategyDirection } from 'libs/routing';
import { SafeDecimal } from 'libs/safedecimal';
import { useCallback, useEffect, useState } from 'react';
import { cn } from 'utils/helpers';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 750,
  marginTop: 10,
  marginBottom: 40,
  marginLeft: 0,
  marginRight: 80,
};

const start = dayjs().unix() - 60 * 60 * 24 * 30 * 12;
const end = dayjs().unix();

export const SimulatorPage = () => {
  const ctx = useStrategyInput();
  const {
    state,
    dispatch,
    state2,
    stateChart,
    dispatchY,
    stateChartInverted,
    y,
  } = ctx;

  const marketPrice = useCompareTokenPrice(
    state2.baseToken?.address,
    state2.quoteToken?.address
  );

  const [initBuyRange, setInitBuyRange] = useState(true);
  const [initSellRange, setInitSellRange] = useState(true);

  // useEffect(() => {
  //   if (!marketPrice || !initBuyRange) return;
  //
  //   const max = (marketPrice - marketPrice * 0.1).toString();
  //   const min = (marketPrice - marketPrice * 0.2).toString();
  //
  //   if (!state.buyMax && !state.buyMin && state2.buy.isRange) {
  //     dispatch('buyMax', max);
  //     dispatch('buyMin', min);
  //   }
  //   if (!state2.buy.isRange) {
  //     dispatch('buyMax', max);
  //     dispatch('buyMin', max);
  //   }
  //
  //   setInitBuyRange(false);
  // }, [
  //   initBuyRange,
  //   dispatch,
  //   marketPrice,
  //   state.buyMax,
  //   state.buyMin,
  //   state2.buy.isRange,
  // ]);

  const handleDefaultValues = useCallback(
    (type: StrategyDirection) => {
      const init = type === 'buy' ? initBuyRange : initSellRange;
      const setInit = type === 'buy' ? setInitBuyRange : setInitSellRange;

      if (!marketPrice || !init) return;
      setInit(false);

      if (!(!state2[type].max && !state2[type].min)) {
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

      if (state2[type].isRange) {
        dispatch(`${type}Max`, max);
        dispatch(`${type}Min`, min);
      } else {
        dispatch(`${type}Max`, max);
        dispatch(`${type}Min`, max);
      }
    },
    [dispatch, initBuyRange, initSellRange, marketPrice, state2]
  );

  useEffect(() => {
    handleDefaultValues('buy');
    handleDefaultValues('sell');
  }, [handleDefaultValues]);

  // useEffect(() => {
  //   if (!marketPrice || !initSellRange) return;
  //
  //   const max = (marketPrice + marketPrice * 0.1).toString();
  //   const min = (marketPrice + marketPrice * 0.2).toString();
  //
  //   if (!state.sellMax && !state.sellMin) {
  //     if (state2.sell.isRange) {
  //       dispatch('sellMax', max);
  //       dispatch('sellMin', min);
  //     } else {
  //       dispatch('sellMax', max);
  //       dispatch('sellMin', max);
  //     }
  //   }
  //
  //   setInitSellRange(false);
  // }, [
  //   dispatch,
  //   initSellRange,
  //   marketPrice,
  //   state.sellMax,
  //   state.sellMin,
  //   state2.sell.isRange,
  // ]);

  const priceHistoryQuery = useGetTokenPriceHistory({
    baseToken: state.baseToken,
    quoteToken: state.quoteToken,
    start,
    end,
  });

  const [ref, dms] = useChartDimensions(chartSettings);

  if (!state2.baseToken || !state2.quoteToken) {
    return <div>loading tokens</div>;
  }

  const isLoading =
    priceHistoryQuery.data && marketPrice && !priceHistoryQuery.isLoading;

  return (
    <>
      <h1 className="mb-16 px-20 text-24 font-weight-500">Simulate Strategy</h1>

      <div className="relative px-20">
        <div className="absolute right-[20px] w-[calc(100%-500px)]">
          <div ref={ref} className="sticky top-50 rounded-12 bg-silver p-20">
            <h2 className="mb-20 text-20 font-weight-500">Price Chart</h2>
            {priceHistoryQuery.isError && <div>Error</div>}
            <div
              className={cn(
                'flex items-center justify-center rounded-12 bg-black',
                {
                  'flex items-center justify-center': isLoading,
                }
              )}
              style={{ height: dms.height }}
            >
              {isLoading ? (
                <svg width={dms.width} height={dms.height}>
                  <g
                    transform={`translate(${dms.marginLeft},${dms.marginTop})`}
                  >
                    <D3ChartCandlesticks
                      state={state2}
                      dispatch={dispatch}
                      data={priceHistoryQuery.data}
                      dms={dms}
                      marketPrice={marketPrice}
                      ctx={ctx}
                    />
                  </g>
                </svg>
              ) : (
                <CarbonLogoLoading className="h-[100px]" />
              )}
            </div>
            <pre>{JSON.stringify(stateChart, null, 2)}</pre>
            <pre>{JSON.stringify(stateChartInverted, null, 2)}</pre>
          </div>
        </div>

        <div className="absolute top-0 w-[440px] space-y-20">
          <SimulatorTokenSelection
            base={state2.baseToken}
            quote={state2.quoteToken}
            dispatch={dispatch}
            setInitBuyRange={setInitBuyRange}
            setInitSellRange={setInitSellRange}
          />
          <SimulatorStrategyType strategyType={state2.simulationType} />

          <BuySellBlock
            buy={false}
            base={state2.baseToken}
            quote={state2.quoteToken}
            order={state2.sell}
            dispatch={dispatch}
            isOrdersOverlap={checkIfOrdersOverlapNew(state2.buy, state2.sell)}
            strategyType="recurring"
            isBudgetOptional={
              +state2.sell.budget === 0 && +state2.buy.budget > 0
            }
          />

          <BuySellBlock
            buy
            base={state2.baseToken}
            quote={state2.quoteToken}
            order={state2.buy}
            dispatch={dispatch}
            isOrdersOverlap={checkIfOrdersOverlapNew(state2.buy, state2.sell)}
            strategyType="recurring"
            isBudgetOptional={
              +state2.buy.budget === 0 && +state2.sell.budget > 0
            }
          />

          <div>
            <Link
              to={'/simulator/result'}
              search={{
                ...state,
                start: start.toString(),
                end: end.toString(),
              }}
            >
              <Button size={'lg'} fullWidth>
                Start Simulation
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/*<pre>{JSON.stringify(search, null, 2)}</pre>*/}
      {/*<pre>{JSON.stringify(state2, null, 2)}</pre>*/}
    </>
  );
};
