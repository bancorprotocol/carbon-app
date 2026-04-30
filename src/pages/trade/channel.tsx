import { useNavigate, useSearch } from '@tanstack/react-router';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
import { ChannelSearch, StrategyDirection } from 'libs/routing/routes/trade';
import { useCallback, useMemo } from 'react';
import { D3DrawingRanges } from 'components/strategies/common/d3Chart/drawing/D3DrawingRanges';
import { CreateGradientOrder } from 'components/strategies/common/gradient/CreateGradientOrder';
import { CreateGradientStrategyForm } from 'components/strategies/common/gradient/CreateGradientStrategyForm';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { GradientOrderBlock } from 'components/strategies/common/types';
import { cn } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { D3ChartToday } from 'components/strategies/common/d3Chart/D3ChartToday';
import { D3EditChannel } from 'components/strategies/common/d3Chart/drawing/D3DrawChannel';
import { ChannelOrder } from 'components/strategies/common/channel/CreateChannelOrder';
import { useGradientChannelOrder } from 'components/strategies/common/channel/utils';
import { isReverseGradientOrders } from 'components/strategies/common/gradient/utils';
import { toOrderSearch } from 'components/strategies/common/useSetOrder';
import style from 'components/strategies/common/order.module.css';

const url = '/trade/channel';
export const TradeChannel = () => {
  const { base, quote, marketPrice } = useStrategyFormCtx();
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

  const setSearch = useCallback(
    (next: Partial<ChannelSearch>) => {
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

  const { drawing, onDrawingUpdate, buy, sell, delta } =
    useGradientChannelOrder(search, setSearch, marketPrice);

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
                delta={delta}
                type={deltaType}
                setDelta={setSearch}
                sell={sell}
                buy={buy}
                setBuy={(next) => setOrder(next, 'buy')}
              />
            </section>
          </article>
        </CreateGradientStrategyForm>
      </CreateLayout>
    </>
  );
};
