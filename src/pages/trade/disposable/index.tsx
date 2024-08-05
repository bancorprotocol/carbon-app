import { Link, useSearch } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
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
import { useMarketPrice } from 'hooks/useMarketPrice';

const url = '/trade/overview/disposable';
export const TradeDisposable = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ from: url });
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setOrder, setDirection } = useSetDisposableOrder(url);

  const buy = search.direction !== 'sell';
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
      <section
        aria-labelledby="trade-form-title"
        className="bg-background-800 flex flex-col gap-20 overflow-auto rounded p-20"
      >
        <header className="flex items-center gap-8">
          <Link
            from="/trade/overview/disposable"
            to=".."
            className="grid size-28 place-items-center rounded-full bg-black"
          >
            <ForwardArrow className="size-14 rotate-180" />
          </Link>
          <h2 id="trade-form-title" className="text-18">
            Trade
          </h2>
        </header>
        <CreateForm
          type="disposable"
          base={base!}
          quote={quote!}
          order0={buy ? order : emptyOrder()}
          order1={buy ? emptyOrder() : order}
        >
          <CreateOrder
            type="disposable"
            base={base!}
            quote={quote!}
            buy={buy}
            order={order}
            setOrder={setOrder}
            warnings={[outSideMarket]}
            settings={
              <TabsMenu>
                <TabsMenuButton
                  onClick={() => setDirection('buy')}
                  variant={buy ? 'buy' : 'black'}
                  data-testid="tab-buy"
                >
                  Buy
                </TabsMenuButton>
                <TabsMenuButton
                  onClick={() => setDirection('sell')}
                  variant={!buy ? 'sell' : 'black'}
                  data-testid="tab-sell"
                >
                  Sell
                </TabsMenuButton>
              </TabsMenu>
            }
          />
        </CreateForm>
      </section>
      <TradeChartSection />
    </>
  );
};
