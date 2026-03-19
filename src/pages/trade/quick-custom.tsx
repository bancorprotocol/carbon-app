import { useNavigate, useSearch } from '@tanstack/react-router';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/context';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { StrategyDirection } from 'libs/routing/routes/trade';
import { useCallback, useEffect, useMemo } from 'react';
import { D3EditLine } from 'components/strategies/common/d3Chart/drawing/D3DrawLine';
import { D3DrawingRanges } from 'components/strategies/common/d3Chart/drawing/D3DrawingRanges';
import { useQuickGradientOrder } from 'components/strategies/common/gradient/useGradientOrder';
import { CreateGradientStrategyForm } from 'components/strategies/common/gradient/CreateGradientStrategyForm';
import { GradientOrderBlock } from 'components/strategies/common/types';
import { toOrderSearch } from 'components/strategies/common/useSetOrder';
import IconDelete from 'assets/icons/trash.svg?react';
import IconAdd from 'assets/icons/plus.svg?react';
import { isReverseGradientOrders } from 'components/strategies/common/gradient/utils';
import { ChartPoint } from 'components/strategies/common/d3Chart/D3ChartContext';
import { cn } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import {
  defaultQuickGradientOrder,
  formatQuickTime,
} from 'components/strategies/common/quick/utils';
import { QuickGradientChart } from 'components/strategies/common/quick/QuickGradientChart';
import { CreateQuickGradientOrder } from 'components/strategies/common/quick/CreateQuickGradientOrder';
import style from 'components/strategies/common/order.module.css';

const url = '/trade/quick-custom';
export const TradeQuickCustom = () => {
  const { base, quote } = useTradeCtx();
  const { marketPrice, isPending: pendingMarketPrice } = useMarketPrice({
    base,
    quote,
  });
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

  const saveOrder = useCallback(
    (next: Partial<GradientOrderBlock>, direction: StrategyDirection) => {
      const params = toOrderSearch(next, direction);
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...params }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const setDirections = useCallback(
    (cb: (direction: StrategyDirection[]) => StrategyDirection[]) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({
          ...previous,
          directions: cb(previous.directions || []),
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const baseBuy = useMemo(() => {
    return defaultQuickGradientOrder(
      {
        direction: 'buy',
        startPrice: search.buyStartPrice,
        endPrice: search.buyEndPrice,
        deltaTime: search.buyDeltaTime,
        budget: search.buyBudget,
      },
      marketPrice,
    );
  }, [
    marketPrice,
    search.buyBudget,
    search.buyEndPrice,
    search.buyDeltaTime,
    search.buyStartPrice,
  ]);

  const baseSell = useMemo(() => {
    return defaultQuickGradientOrder(
      {
        direction: 'sell',
        startPrice: search.sellStartPrice,
        endPrice: search.sellEndPrice,
        deltaTime: search.sellDeltaTime,
        budget: search.sellBudget,
      },
      marketPrice,
    );
  }, [
    marketPrice,
    search.sellBudget,
    search.sellEndPrice,
    search.sellDeltaTime,
    search.sellStartPrice,
  ]);

  const buy = useQuickGradientOrder(baseBuy, (next) => {
    return saveOrder(next, 'buy');
  });
  const sell = useQuickGradientOrder(baseSell, (next) => {
    return saveOrder(next, 'sell');
  });

  useEffect(() => {
    if (pendingMarketPrice) return;
    buy.setOrder(baseBuy);
    sell.setOrder(baseSell);
    // Only run this once the marketprice is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMarketPrice]);

  const orders = useMemo(() => ({ buy, sell }), [buy, sell]);

  const addDirection = useCallback(
    (direction: StrategyDirection) => {
      setDirections((directions) => {
        const set = new Set(directions);
        set.add(direction);
        return Array.from(set);
      });
    },
    [setDirections],
  );
  const removeDirection = useCallback(
    (direction: StrategyDirection) => {
      setDirections((directions) => {
        const set = new Set(directions);
        set.delete(direction);
        saveOrder(
          {
            startPrice: undefined,
            endPrice: undefined,
            startDate: undefined,
            endDate: undefined,
            budget: undefined,
          },
          direction,
        );
        return Array.from(set);
      });
    },
    [setDirections, saveOrder],
  );

  const onDrawingChange = useCallback(
    (points: ChartPoint[], direction: StrategyDirection) => {
      if (points.length) return orders[direction].onDrawingUpdate(points);
      removeDirection(direction);
    },
    [orders, removeDirection],
  );

  const priceError = useMemo(() => {
    if (search.directions?.length !== 2) return;
    if (isReverseGradientOrders(buy.gradientOrder, sell.gradientOrder)) {
      return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid loss of funds.';
    }
  }, [buy.gradientOrder, search.directions?.length, sell.gradientOrder]);

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <QuickGradientChart
          base={base}
          quote={quote}
          orders={[orders.buy.order, orders.sell.order]}
        >
          {search.directions?.map((direction) => (
            <D3EditLine
              key={direction}
              color={direction}
              drawing={orders[direction].drawing}
              onChange={(points) => onDrawingChange(points, direction)}
            />
          ))}
          {search.directions?.map((direction) => (
            <D3DrawingRanges
              key={direction}
              color={direction}
              drawing={orders[direction].drawing}
              formatX={(x) => formatQuickTime(x)}
            />
          ))}
        </QuickGradientChart>
      </StrategyChartSection>
      <CreateLayout url={url}>
        <CreateGradientStrategyForm
          buy={orders.buy.gradientOrder}
          sell={orders.sell.gradientOrder}
        >
          <div className="surface grid gap-16 rounded-2xl overflow-clip">
            {!search.directions?.length && (
              <h2 className="error-message text-16 p-16">
                Please select an order
              </h2>
            )}
            {(['sell', 'buy'] as const).map((direction) => {
              const { order, setOrder } = orders[direction];
              if (search.directions?.includes(direction)) {
                return (
                  <div
                    key={direction}
                    className={cn(
                      style.order,
                      'animate-scale-up relative grid gap-16 p-16',
                    )}
                    data-direction={order.direction}
                  >
                    <CreateQuickGradientOrder
                      order={order}
                      setOrder={setOrder}
                      priceWarning={
                        priceError && <Warning message={priceError} isError />
                      }
                      action={
                        <button
                          type="button"
                          className="absolute right-16 top-28"
                          aria-label={`remove ${direction} order`}
                          onClick={() => removeDirection(direction)}
                        >
                          <IconDelete className="size-16" />
                        </button>
                      }
                    />
                  </div>
                );
              } else {
                return (
                  <div key={direction} className="grid px-16 py-8 last:pb-16">
                    <button
                      type="button"
                      onClick={() => addDirection(direction)}
                      className={cn([
                        'rounded-md grid justify-items-center gap-16 border border-dashed p-16 text-center',
                        direction === 'buy'
                          ? 'hover:bg-buy/10 text-buy border-buy'
                          : 'hover:bg-sell/10 text-sell border-sell',
                      ])}
                    >
                      <IconAdd className="size-24" />
                      <span className="capitalize">Add {direction} Order</span>
                    </button>
                  </div>
                );
              }
            })}
          </div>
        </CreateGradientStrategyForm>
      </CreateLayout>
    </>
  );
};
