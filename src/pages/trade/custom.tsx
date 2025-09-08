import { useNavigate, useSearch } from '@tanstack/react-router';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { StrategyDirection } from 'libs/routing/routes/trade';
import { useCallback, useMemo } from 'react';
import { D3EditLine } from 'components/strategies/common/d3Chart/drawing/D3DrawLine';
import { D3DrawingRanges } from 'components/strategies/common/d3Chart/drawing/D3DrawingRanges';
import { useGradientOrder } from 'components/strategies/common/gradient/useGradientOrder';
import { CreateGradientOrder } from 'components/strategies/common/gradient/CreateGradientOrder';
import { CreateGradientStrategyForm } from 'components/strategies/common/gradient/CreateGradientStrategyForm';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { GradientOrderBlock } from 'components/strategies/common/types';
import { toOrderSearch } from 'components/strategies/common/useSetOrder';
import { ReactComponent as IconDelete } from 'assets/icons/trash.svg';
import { ReactComponent as IconAdd } from 'assets/icons/plus.svg';
import {
  defaultGradientOrder,
  isReverseGradientOrders,
} from 'components/strategies/common/gradient/utils';
import { ChartPoint } from 'components/strategies/common/d3Chart/D3ChartContext';
import { cn } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { useStrategyMarketPrice } from 'components/strategies/UserMarketPrice';
import { D3ChartToday } from 'components/strategies/common/d3Chart/D3ChartToday';
import style from 'components/strategies/common/order.module.css';

const url = '/trade/custom';
export const TradeCustom = () => {
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useStrategyMarketPrice({ base, quote });
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
    return defaultGradientOrder(
      {
        direction: 'buy',
        _sP_: search.buy_SP_,
        _eP_: search.buy_EP_,
        _sD_: search.buy_SD_,
        _eD_: search.buy_ED_,
        budget: search.buyBudget,
      },
      marketPrice,
    );
  }, [
    marketPrice,
    search.buyBudget,
    search.buy_ED_,
    search.buy_EP_,
    search.buy_SD_,
    search.buy_SP_,
  ]);

  const baseSell = useMemo(() => {
    return defaultGradientOrder(
      {
        direction: 'sell',
        _sP_: search.sell_SP_,
        _eP_: search.sell_EP_,
        _sD_: search.sell_SD_,
        _eD_: search.sell_ED_,
        budget: search.sellBudget,
      },
      marketPrice,
    );
  }, [
    marketPrice,
    search.sellBudget,
    search.sell_ED_,
    search.sell_EP_,
    search.sell_SD_,
    search.sell_SP_,
  ]);

  const buy = useGradientOrder(baseBuy, (next) => saveOrder(next, 'buy'));
  const sell = useGradientOrder(baseSell, (next) => saveOrder(next, 'sell'));

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
            _sP_: undefined,
            _eP_: undefined,
            _sD_: undefined,
            _eD_: undefined,
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
    if (isReverseGradientOrders(buy.order, sell.order)) {
      return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid loss of funds.';
    }
  }, [buy.order, search.directions?.length, sell.order]);

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <StrategyChartHistory
          base={base}
          quote={quote}
          buy={orders.buy.order}
          sell={orders.sell.order}
        >
          {search.directions?.map((direction) => (
            <D3EditLine
              key={direction}
              color={direction}
              drawing={orders[direction].drawing}
              onChange={(points) => onDrawingChange(points, direction)}
            />
          ))}
          <TradeChartContent />
          <D3ChartToday />
          {search.directions?.map((direction) => (
            <D3DrawingRanges
              key={direction}
              color={direction}
              drawing={orders[direction].drawing}
            />
          ))}
        </StrategyChartHistory>
      </StrategyChartSection>
      <CreateLayout url={url}>
        <CreateGradientStrategyForm
          buy={orders.buy.order}
          sell={orders.sell.order}
        >
          <article className="bg-background-900 grid gap-16 rounded-b-2xl">
            {!search.directions?.length && (
              <h2 className="error-message text-16 m-0 px-16">
                Please select an order
              </h2>
            )}
            {(['sell', 'buy'] as const).map((direction) => {
              const { order, setOrder } = orders[direction];
              if (search.directions?.includes(direction)) {
                return (
                  <section
                    key={direction}
                    className={cn(
                      style.order,
                      'animate-scale-up relative grid gap-16 p-16',
                    )}
                    data-direction={order.direction}
                  >
                    <button
                      type="button"
                      className="absolute right-16 top-28"
                      aria-label={`remove ${direction} order`}
                      onClick={() => removeDirection(direction)}
                    >
                      <IconDelete className="size-16" />
                    </button>
                    <CreateGradientOrder
                      order={order}
                      setOrder={setOrder}
                      priceWarning={
                        priceError && <Warning message={priceError} isError />
                      }
                    />
                  </section>
                );
              } else {
                return (
                  <div key={direction} className="grid px-16 last:pb-16">
                    <button
                      type="button"
                      onClick={() => addDirection(direction)}
                      className={cn([
                        'rounded-md grid justify-items-center gap-16 border border-dashed p-20 text-center',
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
          </article>
        </CreateGradientStrategyForm>
      </CreateLayout>
    </>
  );
};
