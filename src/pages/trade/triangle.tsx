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
import { cn } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { D3ChartToday } from 'components/strategies/common/d3Chart/D3ChartToday';
import { D3EditLine } from 'components/strategies/common/d3Chart/drawing/D3DrawLine';
import style from 'components/strategies/common/order.module.css';

const url = '/trade/triangle';
export const TradeTriangle = () => {
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

  const sell = useGradientOrder(baseSell, (next) => saveOrder(next, 'sell'));
  const buy = useGradientOrder(baseBuy, (next) => saveOrder(next, 'buy'));

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
          <D3EditLine
            color="sell"
            drawing={sell.drawing}
            onChange={sell.onDrawingUpdate}
          />
          <D3EditLine
            color="buy"
            drawing={buy.drawing}
            onChange={buy.onDrawingUpdate}
          />
          <TradeChartContent />
          <D3ChartToday />
          <D3DrawingRanges color="sell" drawing={sell.drawing} />
          <D3DrawingRanges color="buy" drawing={buy.drawing} />
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
