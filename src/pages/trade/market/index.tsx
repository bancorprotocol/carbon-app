import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { ForwardArrow } from 'components/common/forwardArrow';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { MainMenuTradeSettings } from 'components/core/menu/mainMenu/MainMenuTradeSettings';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useGetTokenBalance } from 'libs/queries';
import { StrategyDirection } from 'libs/routing';
import { TradeMarketSearch } from 'libs/routing/routes/trade';

export const TradeMarket = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ strict: false }) as TradeMarketSearch;
  const navigate = useNavigate({ from: '/trade/overview/market' });
  const sell = search.direction !== 'buy';
  const balanceQuery = useGetTokenBalance(sell ? base : quote);
  const setDirection = (direction: StrategyDirection) => {
    navigate({
      params: (params) => params,
      search: (previous) => ({
        ...previous,
        direction,
      }),
      replace: true,
      resetScroll: false,
    });
  };
  return (
    <>
      <section
        aria-labelledby="trade-form-title"
        className="bg-background-800 flex flex-col gap-20 overflow-auto rounded p-20"
      >
        <header className="flex items-center gap-8">
          <Link
            from="/trade/overview/market"
            to=".."
            className="grid size-28 place-items-center rounded-full bg-black"
          >
            <ForwardArrow className="size-14 rotate-180" />
          </Link>
          <h2 id="trade-form-title" className="text-18 flex-1">
            Spot Trade
          </h2>
          <MainMenuTradeSettings base={base} quote={quote} />
        </header>
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
        <TradeWidgetBuySell
          source={sell ? base : quote}
          target={sell ? quote : base}
          sourceBalanceQuery={balanceQuery}
          buy={!sell}
          data-testid="buy-form"
        />
      </section>
      <TradeChartSection />
    </>
  );
};
