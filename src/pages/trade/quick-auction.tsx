import { useNavigate, useSearch } from '@tanstack/react-router';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  StrategyDirection,
  TradeAuctionSearch,
} from 'libs/routing/routes/trade';
import { useCallback, useEffect, useMemo } from 'react';
import { useQuickGradientOrder } from 'components/strategies/common/gradient/useGradientOrder';
import {
  defaultQuickGradientOrder,
  formatQuickTime,
} from 'components/strategies/common/quick/utils';
import { CreateGradientStrategyForm } from 'components/strategies/common/gradient/CreateGradientStrategyForm';
import { OrderDirection } from 'components/strategies/common/OrderDirection';
import { emptyGradientOrder } from 'components/strategies/common/utils';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { CreateQuickGradientOrder } from 'components/strategies/common/quick/CreateQuickGradientOrder';
import { QuickGradientChart } from 'components/strategies/common/quick/QuickGradientChart';
import { D3EditLine } from 'components/strategies/common/d3Chart/drawing/D3DrawLine';
import { D3DrawingRanges } from 'components/strategies/common/d3Chart/drawing/D3DrawingRanges';
import { cn } from 'utils/helpers';
import style from 'components/strategies/common/order.module.css';
import { defaultGradientMultipliers } from 'components/strategies/common/gradient/utils';

const url = '/trade/quick-auction';
export const TradeQuickAuction = () => {
  const { base, quote } = useStrategyFormCtx();
  const { marketPrice, isPending: pendingMarketPrice } = useMarketPrice({
    base,
    quote,
  });
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

  const direction = search.direction ?? 'sell';
  const multi = useMemo(() => {
    return defaultGradientMultipliers(base.address, quote.address, direction);
  }, [base.address, quote.address, direction]);

  const baseOrder = useMemo(() => {
    return defaultQuickGradientOrder(search, multi, marketPrice);
  }, [search, multi, marketPrice]);
  const { order, setOrder, drawing, onDrawingUpdate, gradientOrder } =
    useQuickGradientOrder(baseOrder, saveOrder);

  const orders = {
    buy: direction === 'buy' ? gradientOrder : emptyGradientOrder(),
    sell: direction === 'sell' ? gradientOrder : emptyGradientOrder(),
  };
  useEffect(() => {
    if (pendingMarketPrice) return;
    setOrder(baseOrder);
    // Run only when market price becomes available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMarketPrice]);

  const setDirection = useCallback(
    (direction: StrategyDirection) => {
      saveOrder({
        direction,
        startPrice: undefined,
        endPrice: undefined,
        budget: undefined,
      });
    },
    [saveOrder],
  );

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <QuickGradientChart orders={[order]}>
          <D3EditLine
            drawing={drawing}
            color={direction}
            onChange={onDrawingUpdate}
          />
          <D3DrawingRanges
            drawing={drawing}
            color={direction}
            formatX={formatQuickTime}
          />
        </QuickGradientChart>
      </StrategyChartSection>
      <CreateLayout url={url}>
        <CreateGradientStrategyForm buy={orders.buy} sell={orders.sell}>
          <div className="surface rounded-2xl grid overflow-clip">
            <OrderDirection direction={direction} setDirection={setDirection} />
            <div
              className={cn(style.order, 'grid gap-16 p-16')}
              data-direction={direction}
              data-disposable={true}
            >
              <CreateQuickGradientOrder order={order} setOrder={setOrder} />
            </div>
          </div>
        </CreateGradientStrategyForm>
      </CreateLayout>
    </>
  );
};
