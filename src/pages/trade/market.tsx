import { useNavigate, useSearch } from '@tanstack/react-router';
import { LogoImager } from 'components/common/imager/Imager';
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
import { cn } from 'utils/helpers';

const url = '/trade/market';
export const TradeMarket = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ strict: false }) as TradeMarketSearch;
  const navigate = useNavigate({ from: url });
  const buy = search.direction === 'buy';
  const balanceQuery = useGetTokenBalance(buy ? quote : base);
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

  const border = buy
    ? 'border-buy/50 focus-within:border-buy'
    : 'border-sell/50 focus-within:border-sell';

  return (
    <>
      <TradeLayout>
        <article
          className={cn(
            'bg-background-900 grid gap-20 rounded border-s p-20',
            border
          )}
        >
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
          <div className="flex items-center justify-between">
            <h2 className="text-18 flex items-center gap-8">
              <span>{buy ? 'Buy Low' : 'Sell High'}</span>
              <LogoImager alt="Token" src={base.logoURI} className="size-18" />
              <span>{base.symbol}</span>
            </h2>
            <MainMenuTradeSettings base={base} quote={quote} />
          </div>
          <TradeWidgetBuySell
            source={buy ? quote : base}
            target={buy ? base : quote}
            sourceBalanceQuery={balanceQuery}
            buy={buy}
            data-testid="buy-form"
          />
        </article>
      </TradeLayout>
      <TradeChartSection />
    </>
  );
};
