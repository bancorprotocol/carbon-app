import { useNavigate, useSearch } from '@tanstack/react-router';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import {
  StrategyDirection,
  TradeAuctionSearch,
} from 'libs/routing/routes/trade';
import { useCallback, useMemo } from 'react';
import { D3EditLine } from 'components/strategies/common/d3Chart/drawing/D3DrawLine';
import { D3DrawingRanges } from 'components/strategies/common/d3Chart/drawing/D3DrawingRanges';
import { useGradientOrder } from 'components/strategies/common/gradient/useGradientOrder';
import { CreateGradientOrder } from 'components/strategies/common/gradient/CreateGradientOrder';
import { defaultGradientOrder } from 'components/strategies/common/gradient/utils';
import { CreateGradientStrategyForm } from 'components/strategies/common/gradient/CreateGradientStrategyForm';
import { OrderDirection } from 'components/strategies/common/OrderDirection';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { emptyGradientOrder } from 'components/strategies/common/utils';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { useStrategyMarketPrice } from 'components/strategies/UserMarketPrice';
import { D3ChartToday } from 'components/strategies/common/d3Chart/D3ChartToday';
import { cn } from 'utils/helpers';
import style from 'components/strategies/common/order.module.css';

const url = '/trade/auction';
export const TradeAuction = () => {
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useStrategyMarketPrice({ base, quote });
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

  const saveOrder = useCallback(
    (next: TradeAuctionSearch) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const baseOrder = useMemo(() => {
    return defaultGradientOrder(search, marketPrice);
  }, [search, marketPrice]);
  const { order, setOrder, drawing, onDrawingUpdate } = useGradientOrder(
    baseOrder,
    saveOrder,
  );
  const direction = order.direction;
  const orders = {
    buy: direction === 'buy' ? order : emptyGradientOrder(),
    sell: direction === 'sell' ? order : emptyGradientOrder(),
  };

  const setDirection = useCallback(
    (direction: StrategyDirection) => {
      const next = defaultGradientOrder(
        { direction, budget: order.budget },
        marketPrice,
      );
      delete next.marginalPrice;
      setOrder(next);
    },
    [marketPrice, order.budget, setOrder],
  );

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <StrategyChartHistory
          base={base}
          quote={quote}
          direction={direction}
          {...orders}
        >
          <D3EditLine
            drawing={drawing}
            color={direction}
            onChange={onDrawingUpdate}
          />
          <TradeChartContent />
          <D3ChartToday />
          <D3DrawingRanges drawing={drawing} color={direction} />
        </StrategyChartHistory>
      </StrategyChartSection>
      <CreateLayout url={url}>
        <CreateGradientStrategyForm buy={orders.buy} sell={orders.sell}>
          <article className="bg-background-900 grid rounded-b-2xl">
            <OrderDirection direction={direction} setDirection={setDirection} />
            <div
              className={cn(style.order, 'grid gap-16 p-16')}
              data-direction={direction}
            >
              <CreateGradientOrder order={order} setOrder={setOrder} />
            </div>
          </article>
        </CreateGradientStrategyForm>
      </CreateLayout>
    </>
  );
};
