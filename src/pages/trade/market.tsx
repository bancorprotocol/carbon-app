import { useNavigate, useSearch } from '@tanstack/react-router';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { MainMenuTradeSettings } from 'components/core/menu/mainMenu/MainMenuTradeSettings';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { TradeLayout } from 'components/trade/TradeLayout';
import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useGetTokenBalance } from 'libs/queries';
import { StrategyDirection } from 'libs/routing';
import { TradeMarketSearch } from 'libs/routing/routes/trade';

const url = '/trade/market';
export const TradeMarket = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ strict: false }) as TradeMarketSearch;
  const navigate = useNavigate({ from: url });
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
      <TradeLayout>
        <header className="flex items-center justify-between">
          <h2>Spot Trade</h2>
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
      </TradeLayout>
      <TradeChartSection />
    </>
  );
};
