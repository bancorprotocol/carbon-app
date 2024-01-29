import { Link } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { BuySellBlock } from 'components/simulator/BuySellBlockNew';
import { checkIfOrdersOverlapNew } from 'components/strategies/utils';
import dayjs from 'dayjs';
import { useModal } from 'hooks/useModal';
import { useStrategyInput } from 'hooks/useStrategyInput';
import { D3ChartSettingsProps, useChartDimensions } from 'libs/d3';
import { D3ChartCandlesticks } from 'libs/d3/charts/candlestick/D3ChartCandlesticks';
import {
  useCompareTokenPrice,
  useGetTokenPriceHistory,
} from 'libs/queries/extApi/tokenPrice';
import { useEffect, useState } from 'react';

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 750,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 0,
  marginRight: 70,
};

const start = dayjs().unix() - 60 * 60 * 24 * 30 * 12;
const end = dayjs().unix();

export const SimulatorPage = () => {
  const { openModal } = useModal();
  const { state, dispatch, state2 } = useStrategyInput();

  const marketPrice = useCompareTokenPrice(
    state2.baseToken?.address,
    state2.quoteToken?.address
  );

  const [initBuyRange, setInitBuyRange] = useState(true);
  const [initSellRange, setInitSellRange] = useState(true);

  useEffect(() => {
    if (!marketPrice || !initBuyRange) return;

    if (!state.buyMax && !state.buyMin) {
      dispatch('buyMax', (marketPrice - marketPrice * 0.1).toString());
      dispatch('buyMin', (marketPrice - marketPrice * 0.2).toString());
    }
    setInitBuyRange(false);
  }, [initBuyRange, dispatch, marketPrice, state.buyMax, state.buyMin]);

  useEffect(() => {
    if (!marketPrice || !initSellRange) return;

    if (!state.sellMax && !state.sellMin) {
      dispatch('sellMax', (marketPrice + marketPrice * 0.2).toString());
      dispatch('sellMin', (marketPrice + marketPrice * 0.1).toString());
    }
    setInitSellRange(false);
  }, [dispatch, initSellRange, marketPrice, state.sellMax, state.sellMin]);

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

  return (
    <>
      <div className="relative px-20">
        {/*<div className="absolute inset-0">*/}
        <div className="absolute right-[20px] w-[calc(100%-500px)]">
          <div ref={ref} className="sticky top-50">
            {priceHistoryQuery.isLoading && <div>Loading...</div>}
            {priceHistoryQuery.isError && <div>Error</div>}
            {dms.width}
            <svg width={dms.width} height={dms.height}>
              <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
                <>
                  {priceHistoryQuery.data && (
                    <D3ChartCandlesticks
                      state={state}
                      dispatch={dispatch}
                      data={priceHistoryQuery.data}
                      dms={dms}
                      marketPrice={marketPrice}
                    />
                  )}
                </>
              </g>
            </svg>
            {/*</div>*/}
          </div>
        </div>
        <div className="absolute top-0 w-[440px] space-y-20">
          <div className={'space-y-10'}>
            <div className={'flex space-x-20'}>
              <Button
                className={'w-[200px]'}
                onClick={() => {
                  openModal('tokenLists', {
                    onClick: (token) => {
                      dispatch('baseToken', token.address);
                    },
                  });
                }}
              >
                {state2.baseToken
                  ? state2.baseToken.symbol
                  : 'Select Base Token'}
              </Button>
            </div>

            <div className={'flex space-x-20'}>
              <Button
                className={'w-[200px]'}
                onClick={() => {
                  openModal('tokenLists', {
                    onClick: (token) => {
                      dispatch('quoteToken', token.address);
                    },
                  });
                }}
              >
                {state2.quoteToken
                  ? state2.quoteToken.symbol
                  : 'Select Quote Token'}
              </Button>
            </div>
          </div>

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
