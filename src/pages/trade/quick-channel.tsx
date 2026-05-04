import { useNavigate, useSearch } from '@tanstack/react-router';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { StrategyDirection } from 'libs/routing/routes/trade';
import { useCallback, useEffect, useMemo } from 'react';
import { D3DrawingRanges } from 'components/strategies/common/d3Chart/drawing/D3DrawingRanges';
import { useQuickGradientOrder } from 'components/strategies/common/gradient/useGradientOrder';
import { CreateGradientStrategyForm } from 'components/strategies/common/gradient/CreateGradientStrategyForm';
import { GradientOrderBlock } from 'components/strategies/common/types';
import { toOrderSearch } from 'components/strategies/common/useSetOrder';
import {
  defaultGradientMultipliers,
  isReverseGradientOrders,
} from 'components/strategies/common/gradient/utils';
import {
  ChartPoint,
  Drawing,
} from 'components/strategies/common/d3Chart/D3ChartContext';
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
import { D3EditChannel } from 'components/strategies/common/d3Chart/drawing/D3DrawChannel';
import style from 'components/strategies/common/order.module.css';

const url = '/trade/quick-channel';
export const TradeQuickChannel = () => {
  const { base, quote } = useStrategyFormCtx();
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

  const baseSell = useMemo(() => {
    return defaultQuickGradientOrder(
      {
        direction: 'sell',
        startPrice: search.sellStartPrice,
        endPrice: search.sellEndPrice,
        deltaTime: search.sellDeltaTime,
        budget: search.sellBudget,
      },
      defaultGradientMultipliers(base.address, quote.address, 'sell'),
      marketPrice,
    );
  }, [
    search.sellStartPrice,
    search.sellEndPrice,
    search.sellDeltaTime,
    search.sellBudget,
    base.address,
    quote.address,
    marketPrice,
  ]);

  const baseBuy = useMemo(() => {
    return defaultQuickGradientOrder(
      {
        direction: 'buy',
        startPrice: search.buyStartPrice,
        endPrice: search.buyEndPrice,
        deltaTime: search.buyDeltaTime,
        budget: search.buyBudget,
      },
      defaultGradientMultipliers(base.address, quote.address, 'sell'),
      marketPrice,
    );
  }, [
    search.buyStartPrice,
    search.buyEndPrice,
    search.buyDeltaTime,
    search.buyBudget,
    base.address,
    quote.address,
    marketPrice,
  ]);

  const buy = useQuickGradientOrder('channel', baseBuy, (next) => {
    return saveOrder(next, 'buy');
  });
  const sell = useQuickGradientOrder('channel', baseSell, (next) => {
    return saveOrder(next, 'sell');
  });

  useEffect(() => {
    if (pendingMarketPrice) return;
    buy.setOrder(baseBuy);
    sell.setOrder(baseSell);
    // Only run this once the marketprice is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMarketPrice]);

  const drawing = useMemo(
    () =>
      ({
        id: 'quick-channel',
        mode: 'channel',
        points: [...buy.drawing.points, ...sell.drawing.points],
      }) satisfies Drawing,
    [buy.drawing, sell.drawing],
  );

  const onDrawingChange = (points: ChartPoint[]) => {
    buy.onDrawingUpdate([points[0], points[1]]);
    sell.onDrawingUpdate([points[2], points[3]]);
  };

  const priceError = useMemo(() => {
    if (isReverseGradientOrders(buy.gradientOrder, sell.gradientOrder)) {
      return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid loss of funds.';
    }
  }, [buy.gradientOrder, sell.gradientOrder]);

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <QuickGradientChart orders={[buy.order, sell.order]}>
          <D3EditChannel
            colors={['sell', 'buy']}
            drawing={drawing}
            onChange={onDrawingChange}
          />
          <D3DrawingRanges
            color="secondary"
            drawing={drawing}
            formatX={formatQuickTime}
          />
        </QuickGradientChart>
      </StrategyChartSection>
      <CreateLayout url={url}>
        <CreateGradientStrategyForm
          buy={buy.gradientOrder}
          sell={sell.gradientOrder}
        >
          <div className="surface grid rounded-2xl overflow-clip">
            <div
              className={cn(style.order, 'relative grid gap-16 p-16')}
              data-direction="sell"
            >
              <CreateQuickGradientOrder
                order={sell.order}
                setOrder={sell.setOrder}
                priceWarning={
                  priceError && <Warning message={priceError} isError />
                }
              />
            </div>
            <div
              className={cn(style.order, 'relative grid gap-16 p-16')}
              data-direction="buy"
            >
              <CreateQuickGradientOrder
                order={buy.order}
                setOrder={buy.setOrder}
                priceWarning={
                  priceError && <Warning message={priceError} isError />
                }
              />
            </div>
          </div>
        </CreateGradientStrategyForm>
      </CreateLayout>
    </>
  );
};
