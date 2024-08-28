import { useNavigate, useSearch } from '@tanstack/react-router';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { useSetDisposableOrder } from 'components/strategies/common/useSetOrder';
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

const url = '/trade/disposable';
export const TradeDisposable = () => {
  const { base, quote } = useTradeCtx();
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const buy = search.direction === 'buy';
  const { marketPrice } = useMarketPrice({ base, quote });

  const order = getDefaultOrder(buy ? 'buy' : 'sell', search, marketPrice);

  const { setOrder } = useSetDisposableOrder(url);

  const setDirection = (direction: StrategyDirection) => {
    const settings = search.settings;
    const { min, max } = getDefaultOrder(direction, { settings }, marketPrice);
    navigate({
      params: (params) => params,
      search: (previous) => ({
        ...previous,
        direction,
        budget: undefined,
        min,
        max,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  // Warnings
  const outSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order.min,
    max: order.max,
    buy,
  });
  const order0 = buy ? order : emptyOrder();
  const order1 = buy ? emptyOrder() : order;
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
            buy={buy}
            order={order}
            setOrder={setOrder}
            warnings={[outSideMarket]}
            settings={
              <TabsMenu>
                <TabsMenuButton
                  onClick={() => setDirection('sell')}
                  variant={buy ? 'black' : 'sell'}
                  data-testid="tab-sell"
                >
                  Sell
                </TabsMenuButton>
                <TabsMenuButton
                  onClick={() => setDirection('buy')}
                  variant={!buy ? 'black' : 'buy'}
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
          order0={order0}
          order1={order1}
          isLimit={isLimit}
        />
      </TradeChartSection>
    </>
  );
};
