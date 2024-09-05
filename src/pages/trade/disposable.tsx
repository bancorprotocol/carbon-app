import { useNavigate, useSearch } from '@tanstack/react-router';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { OnPriceUpdates } from 'components/simulator/input/d3Chart';
import {
  emptyOrder,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { getDefaultOrder } from 'components/strategies/create/utils';
import { TradeChartHistory } from 'components/trade/TradeChartHistory';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { TradeLayout } from 'components/trade/TradeLayout';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { StrategyDirection } from 'libs/routing';
import { TradeDisposableSearch } from 'libs/routing/routes/trade';
import { useCallback } from 'react';

const url = '/trade/disposable';
export const TradeDisposable = () => {
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useMarketPrice({ base, quote });
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

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
  return (
    <>
      <TradeLayout>
        <CreateForm
          type="disposable"
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
        >
          <CreateOrder
            type="disposable"
            base={base}
            quote={quote}
            buy={isBuy}
            order={order}
            setOrder={setSearch}
            warnings={[outSideMarket]}
            settings={
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
            }
          />
        </CreateForm>
      </TradeLayout>
      <TradeChartSection>
        <TradeChartHistory
          type="disposable"
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          isLimit={isLimit}
          direction={search.direction ?? 'sell'}
          onPriceUpdates={onPriceUpdates}
        />
      </TradeChartSection>
    </>
  );
};
