import { useNavigate, useSearch } from '@tanstack/react-router';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import {
  emptyOrder,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { getDefaultOrder } from 'components/strategies/create/utils';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { TradeLayout } from 'components/trade/TradeLayout';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { StrategyDirection } from 'libs/routing';
import { TradeDisposableSearch } from 'libs/routing/routes/trade';
import { useCallback } from 'react';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { OverlappingInitMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';

const url = '/trade/disposable';
export const TradeDisposable = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();

  const isBuy = search.direction === 'buy';
  const order = getDefaultOrder(isBuy ? 'buy' : 'sell', search, marketPrice);

  const setSearch = useCallback(
    (next: TradeDisposableSearch) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const setDirection = (direction: StrategyDirection) => {
    setSearch({ direction, budget: undefined, min: undefined, max: undefined });
  };

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      if (isBuy) setSearch({ min: buy.min, max: buy.max });
      else setSearch({ min: sell.min, max: sell.max });
    },
    [setSearch, isBuy]
  );

  // Warnings
  const outSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order.min,
    max: order.max,
    buy: isBuy,
  });
  const order0 = isBuy ? order : emptyOrder();
  const order1 = isBuy ? emptyOrder() : order;
  const isLimit = {
    buy: order.settings !== 'range',
    sell: order.settings !== 'range',
  };

  const setMarketPrice = useCallback(
    (marketPrice: string) => {
      navigate({
        search: (previous) => ({ ...previous, marketPrice }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  if (!marketPrice && marketQuery.isPending) {
    return (
      <TradeLayout>
        <CarbonLogoLoading className="h-[80px] place-self-center" />
      </TradeLayout>
    );
  }

  if (!marketPrice) {
    return (
      <>
        <TradeLayout>
          <article
            key="marketPrice"
            className="bg-background-900 rounded-ee rounded-es"
          >
            <OverlappingInitMarketPrice
              base={base}
              quote={quote}
              setMarketPrice={(price) => setMarketPrice(price)}
            />
          </article>
        </TradeLayout>
        <StrategyChartSection>
          <StrategyChartHistory
            type="recurring"
            base={base}
            quote={quote}
            order0={order0}
            order1={order1}
            isLimit={isLimit}
            onPriceUpdates={onPriceUpdates}
          />
        </StrategyChartSection>
      </>
    );
  }

  return (
    <>
      <TradeLayout>
        <CreateForm base={base} quote={quote} order0={order0} order1={order1}>
          <CreateOrder
            type="disposable"
            base={base}
            quote={quote}
            buy={isBuy}
            order={order}
            setOrder={setSearch}
            warnings={[outSideMarket]}
            settings={
              <div className="p-16 pb-0">
                <TabsMenu>
                  <TabsMenuButton
                    onClick={() => setDirection('sell')}
                    variant={isBuy ? 'black' : 'sell'}
                    data-testid="tab-sell"
                  >
                    Sell
                  </TabsMenuButton>
                  <TabsMenuButton
                    onClick={() => setDirection('buy')}
                    variant={!isBuy ? 'black' : 'buy'}
                    data-testid="tab-buy"
                  >
                    Buy
                  </TabsMenuButton>
                </TabsMenu>
              </div>
            }
          />
        </CreateForm>
      </TradeLayout>
      <StrategyChartSection>
        <StrategyChartHistory
          type="disposable"
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          isLimit={isLimit}
          direction={search.direction ?? 'sell'}
          onPriceUpdates={onPriceUpdates}
        />
      </StrategyChartSection>
    </>
  );
};
