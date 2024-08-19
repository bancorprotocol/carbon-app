import { useSearch } from '@tanstack/react-router';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { OrderBlock } from 'components/strategies/common/types';
import { useSetDisposableOrder } from 'components/strategies/common/useSetOrder';
import {
  emptyOrder,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { TradeLayout } from 'components/trade/TradeLayout';
import { useMarketPrice } from 'hooks/useMarketPrice';

const url = '/trade/disposable';
export const TradeDisposable = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ from: url });
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setOrder, setDirection } = useSetDisposableOrder(url);

  const sell = search.direction !== 'buy';
  const order: OrderBlock = {
    min: search.min ?? '',
    max: search.max ?? '',
    budget: search.budget ?? '',
    settings: search.settings ?? 'limit',
  };

  // Warnings
  const outSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.min,
    max: search.max,
    buy: search.direction !== 'sell',
  });
  return (
    <>
      <TradeLayout>
        <header className="flex items-center justify-between">
          <h2>Trade</h2>
        </header>
        <CreateForm
          type="disposable"
          base={base!}
          quote={quote!}
          order0={sell ? emptyOrder() : order}
          order1={sell ? order : emptyOrder()}
        >
          <CreateOrder
            type="disposable"
            base={base!}
            quote={quote!}
            buy={!sell}
            order={order}
            setOrder={setOrder}
            warnings={[outSideMarket]}
            settings={
              <TabsMenu>
                <TabsMenuButton
                  onClick={() => setDirection('sell')}
                  variant={sell ? 'sell' : 'black'}
                  data-testid="tab-sell"
                >
                  Sell
                </TabsMenuButton>
                <TabsMenuButton
                  onClick={() => setDirection('buy')}
                  variant={!sell ? 'buy' : 'black'}
                  data-testid="tab-buy"
                >
                  Buy
                </TabsMenuButton>
              </TabsMenu>
            }
          />
        </CreateForm>
      </TradeLayout>
      <TradeChartSection />
    </>
  );
};
