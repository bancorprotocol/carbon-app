import { useNavigate, useSearch } from '@tanstack/react-router';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { MainMenuTradeSettings } from 'components/core/menu/mainMenu/MainMenuTradeSettings';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { TradeLayout } from 'components/trade/TradeLayout';
import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useGetTokenBalance } from 'libs/queries';
import { StrategyDirection } from 'libs/routing';
import { cn } from 'utils/helpers';
import style from 'components/strategies/common/order.module.css';
import { PairChartHistory } from 'components/strategies/common/PairChartHistory';

const url = '/trade/market';
export const TradeMarket = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ from: url });
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

  return (
    <>
      <TradeLayout>
        <article className="bg-background-900 grid rounded-ee rounded-es">
          <div className="p-16 pb-0">
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
          </div>
          <div
            className={cn(style.order, 'p-16')}
            data-direction={buy ? 'buy' : 'sell'}
          >
            <header className="flex items-center justify-between">
              <h2 className="text-18 flex items-center gap-8">
                {buy ? 'Buy' : 'Sell'} {base.symbol}&nbsp;
                {buy ? 'with' : 'for'} {quote.symbol}
              </h2>
              <MainMenuTradeSettings />
            </header>
            <TradeWidgetBuySell
              source={buy ? quote : base}
              target={buy ? base : quote}
              sourceBalanceQuery={balanceQuery}
              buy={buy}
              data-testid={buy ? 'buy-form' : 'sell-form'}
            />
          </div>
        </article>
      </TradeLayout>
      <StrategyChartSection>
        <PairChartHistory base={base} quote={quote} />
      </StrategyChartSection>
    </>
  );
};
