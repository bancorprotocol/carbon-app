import { useNavigate, useSearch } from '@tanstack/react-router';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import { StrategyDirection } from 'libs/routing/routes/trade';
import { useCallback, useMemo } from 'react';
import { D3DrawingRanges } from 'components/strategies/common/d3Chart/drawing/D3DrawingRanges';
import { CreateGradientOrder } from 'components/strategies/common/gradient/CreateGradientOrder';
import { CreateGradientStrategyForm } from 'components/strategies/common/gradient/CreateGradientStrategyForm';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { GradientOrderBlock } from 'components/strategies/common/types';
import { toOrderSearch } from 'components/strategies/common/useSetOrder';
import { isReverseGradientOrders } from 'components/strategies/common/gradient/utils';
import { cn } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { D3ChartToday } from 'components/strategies/common/d3Chart/D3ChartToday';
import { D3EditChannel } from 'components/strategies/common/d3Chart/drawing/D3DrawChannel';
import { ChannelOrder } from 'components/strategies/common/channel/CreateChannelOrder';
import {
  defaultChannelOrder,
  DeltaType,
  useGradientChannelOrder,
} from 'components/strategies/common/channel/utils';
import style from 'components/strategies/common/order.module.css';

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

  const setType = useCallback(
    (deltaType: DeltaType) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, deltaType }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const baseSell = useMemo(() => {
    return defaultChannelOrder(
      {
        direction: 'sell',
        startPrice: search.sellStartPrice,
        endPrice: search.sellEndPrice,
        budget: search.sellBudget,
        startDate: search.sellStartDate,
        endDate: search.sellEndDate,
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

  const baseBuy = useMemo(() => {
    return defaultChannelOrder(
      {
        direction: 'buy',
        startPrice: search.buyStartPrice,
        endPrice: search.buyEndPrice,
        startDate: search.buyStartDate,
        // We use sell start & end dates as reference
        endDate: search.sellEndDate,
        budget: search.sellBudget,
      },
      marketPrice,
    );
  }, [
    marketPrice,
    search.buyEndPrice,
    search.buyStartDate,
    search.buyStartPrice,
    search.sellBudget,
    search.sellEndDate,
  ]);

  const { drawing, onDrawingUpdate, buy, sell, setBuy, setSell } =
    useGradientChannelOrder(
      baseBuy,
      baseSell,
      (next) => saveOrder(next, 'buy'),
      (next) => saveOrder(next, 'sell'),
    );

  const priceError = useMemo(() => {
    if (isReverseGradientOrders(buy, sell)) {
      return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid loss of funds.';
    }
  }, [buy, sell]);

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <StrategyChartHistory buy={buy} sell={sell}>
          <D3EditChannel
            colors={['sell', 'buy']}
            drawing={drawing}
            onChange={onDrawingUpdate}
          />
          <TradeChartContent />
          <D3ChartToday />
          <D3DrawingRanges color="secondary" drawing={drawing} />
        </StrategyChartHistory>
      </StrategyChartSection>
      <CreateLayout url={url}>
        <CreateGradientStrategyForm buy={buy} sell={sell}>
          <article className="surface grid rounded-2xl overflow-clip">
            <section
              className={cn(style.order, 'relative grid gap-16 p-16')}
              data-direction="sell"
            >
              <CreateGradientOrder
                order={sell}
                setOrder={setSell}
                priceWarning={
                  priceError && <Warning message={priceError} isError />
                }
              />
            </section>
            <section
              className={cn(style.order, 'relative grid gap-16 p-16')}
              data-direction="buy"
            >
              <ChannelOrder
                type={search.deltaType ?? 'percent'}
                setType={setType}
                order={buy}
                otherOrder={sell}
                setOrder={setBuy}
              />
            </section>
          </article>
        </CreateGradientStrategyForm>
      </CreateLayout>
    </>
  );
};
