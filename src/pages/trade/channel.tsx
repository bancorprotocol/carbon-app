import { useNavigate, useSearch } from '@tanstack/react-router';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import { StrategyDirection } from 'libs/routing/routes/trade';
import { useCallback, useMemo } from 'react';
import { D3DrawingRanges } from 'components/strategies/common/d3Chart/drawing/D3DrawingRanges';
import { useGradientOrder } from 'components/strategies/common/gradient/useGradientOrder';
import { CreateGradientOrder } from 'components/strategies/common/gradient/CreateGradientOrder';
import { CreateGradientStrategyForm } from 'components/strategies/common/gradient/CreateGradientStrategyForm';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { GradientOrderBlock } from 'components/strategies/common/types';
import { toOrderSearch } from 'components/strategies/common/useSetOrder';
import {
  defaultGradientOrder,
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
import { D3ChartToday } from 'components/strategies/common/d3Chart/D3ChartToday';
import style from 'components/strategies/common/order.module.css';
import { D3EditChannel } from 'components/strategies/common/d3Chart/drawing/D3DrawChannel';

const url = '/trade/channel';
export const TradeChannel = () => {
  const { base, quote, marketPrice } = useStrategyFormCtx();
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

  const baseBuy = useMemo(() => {
    return defaultGradientOrder(
      'channel',
      {
        direction: 'buy',
        startPrice: search.buyStartPrice,
        endPrice: search.buyEndPrice,
        startDate: search.buyStartDate,
        endDate: search.buyEndDate,
        budget: search.buyBudget,
      },
      marketPrice,
    );
  }, [
    marketPrice,
    search.buyBudget,
    search.buyEndDate,
    search.buyEndPrice,
    search.buyStartDate,
    search.buyStartPrice,
  ]);

  const baseSell = useMemo(() => {
    return defaultGradientOrder(
      'channel',
      {
        direction: 'sell',
        startPrice: search.sellStartPrice,
        endPrice: search.sellEndPrice,
        startDate: search.sellStartDate,
        endDate: search.sellEndDate,
        budget: search.sellBudget,
      },
      marketPrice,
    );
  }, [
    marketPrice,
    search.sellBudget,
    search.sellEndDate,
    search.sellEndPrice,
    search.sellStartDate,
    search.sellStartPrice,
  ]);

  const buy = useGradientOrder('channel', baseBuy, (next) =>
    saveOrder(next, 'buy'),
  );
  const sell = useGradientOrder('channel', baseSell, (next) =>
    saveOrder(next, 'sell'),
  );

  const onDrawingChange = (points: ChartPoint[]) => {
    buy.onDrawingUpdate([points[0], points[1]]);
    sell.onDrawingUpdate([points[2], points[3]]);
  };

  const drawing = useMemo(
    () =>
      ({
        id: 'channel',
        mode: 'channel',
        points: [...buy.drawing.points, ...sell.drawing.points],
      }) satisfies Drawing,
    [buy.drawing, sell.drawing],
  );

  const priceError = useMemo(() => {
    if (isReverseGradientOrders(buy.order, sell.order)) {
      return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid loss of funds.';
    }
  }, [buy.order, sell.order]);

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <StrategyChartHistory buy={buy.order} sell={sell.order}>
          <D3EditChannel
            colors={['sell', 'buy']}
            drawing={drawing}
            onChange={onDrawingChange}
          />
          <TradeChartContent />
          <D3ChartToday />
          <D3DrawingRanges color="secondary" drawing={drawing} />
        </StrategyChartHistory>
      </StrategyChartSection>
      <CreateLayout url={url}>
        <CreateGradientStrategyForm buy={buy.order} sell={sell.order}>
          <article className="surface grid rounded-2xl overflow-clip">
            <section
              className={cn(style.order, 'relative grid gap-16 p-16')}
              data-direction="sell"
            >
              <CreateGradientOrder
                order={sell.order}
                setOrder={sell.setOrder}
                priceWarning={
                  priceError && <Warning message={priceError} isError />
                }
              />
            </section>
            <section
              className={cn(style.order, 'relative grid gap-16 p-16')}
              data-direction="buy"
            >
              <CreateGradientOrder
                order={buy.order}
                setOrder={buy.setOrder}
                priceWarning={
                  priceError && <Warning message={priceError} isError />
                }
              />
            </section>
          </article>
        </CreateGradientStrategyForm>
      </CreateLayout>
    </>
  );
};
