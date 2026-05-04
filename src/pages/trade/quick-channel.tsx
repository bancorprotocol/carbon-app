import { useNavigate, useSearch } from '@tanstack/react-router';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import {
  QuickChannelSearch,
  StrategyDirection,
} from 'libs/routing/routes/trade';
import { useCallback, useMemo } from 'react';
import { D3DrawingRanges } from 'components/strategies/common/d3Chart/drawing/D3DrawingRanges';
import { CreateGradientStrategyForm } from 'components/strategies/common/gradient/CreateGradientStrategyForm';
import { GradientOrderBlock } from 'components/strategies/common/types';
import { toOrderSearch } from 'components/strategies/common/useSetOrder';
import { isReverseGradientOrders } from 'components/strategies/common/gradient/utils';
import { cn } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import {
  formatQuickTime,
  quickToGradientOrder,
} from 'components/strategies/common/quick/utils';
import { QuickGradientChart } from 'components/strategies/common/quick/QuickGradientChart';
import { CreateQuickGradientOrder } from 'components/strategies/common/quick/CreateQuickGradientOrder';
import { D3EditChannel } from 'components/strategies/common/d3Chart/drawing/D3DrawChannel';
import { ChannelOrder } from 'components/strategies/common/channel/CreateChannelOrder';
import { useQuickGradientChannelOrder } from 'components/strategies/common/channel/utils';
import style from 'components/strategies/common/order.module.css';

const url = '/trade/quick-channel';
export const TradeQuickChannel = () => {
  const { base, quote, marketPrice } = useStrategyFormCtx();
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

  const setSearch = useCallback(
    (next: Partial<QuickChannelSearch>) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const setOrder = useCallback(
    (next: Partial<GradientOrderBlock>, direction: StrategyDirection) => {
      const params = toOrderSearch(next, direction);
      setSearch(params);
    },
    [setSearch],
  );

  const deltaType = search.deltaType ?? 'percent';

  const { drawing, onDrawingUpdate, buy, sell, deltaPrice } =
    useQuickGradientChannelOrder(search, setSearch, marketPrice);

  const buyGradient = useMemo(() => quickToGradientOrder(buy), [buy]);
  const sellGradient = useMemo(() => quickToGradientOrder(sell), [sell]);

  const priceError = useMemo(() => {
    if (isReverseGradientOrders(buyGradient, sellGradient)) {
      return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid loss of funds.';
    }
  }, [buyGradient, sellGradient]);

  return (
    <>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
        <QuickGradientChart orders={[buy, sell]}>
          <D3EditChannel
            colors={['sell', 'buy']}
            drawing={drawing}
            onChange={onDrawingUpdate}
          />
          <D3DrawingRanges
            color="secondary"
            drawing={drawing}
            formatX={formatQuickTime}
          />
        </QuickGradientChart>
      </StrategyChartSection>
      <CreateLayout url={url}>
        <CreateGradientStrategyForm sell={sellGradient} buy={buyGradient}>
          <article className="surface grid rounded-2xl overflow-clip">
            <section
              className={cn(style.order, 'relative grid gap-16 p-16')}
              data-direction="sell"
            >
              <CreateQuickGradientOrder
                order={sell}
                setOrder={(next) => setOrder(next, 'sell')}
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
                delta={deltaPrice}
                type={deltaType}
                setDelta={setSearch}
                sell={sellGradient}
                buy={buyGradient}
                setBuy={(next) => setOrder(next, 'buy')}
              />
            </section>
          </article>
        </CreateGradientStrategyForm>
      </CreateLayout>
    </>
  );
};
