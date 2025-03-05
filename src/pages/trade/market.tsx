import { useNavigate, useSearch } from '@tanstack/react-router';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { MainMenuTradeSettings } from 'components/core/menu/mainMenu/MainMenuTradeSettings';
import { emptyOrder } from 'components/strategies/common/utils';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { TradeLayout } from 'components/trade/TradeLayout';
import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useGetTokenBalance } from 'libs/queries';
import { StrategyDirection } from 'libs/routing';
import { cn } from 'utils/helpers';
import style from 'components/strategies/common/order.module.css';

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
        <article
          className={cn(
            'bg-background-900 grid gap-16 rounded-ee rounded-es p-16',
            style.order
          )}
          data-direction={buy ? 'buy' : 'sell'}
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
              {buy ? 'Buy' : 'Sell'} {base.symbol} {buy ? 'with' : 'for'}&nbsp;
              {quote.symbol}
            </h2>
            <MainMenuTradeSettings base={base} quote={quote} />
          </div>
          <TradeWidgetBuySell
            source={buy ? quote : base}
            target={buy ? base : quote}
            sourceBalanceQuery={balanceQuery}
            buy={buy}
            data-testid={buy ? 'buy-form' : 'sell-form'}
          />
        </article>
      </TradeLayout>
      <StrategyChartSection>
        <StrategyChartHistory
          type="market"
          base={base}
          quote={quote}
          order0={emptyOrder()}
          order1={emptyOrder()}
        />
      </StrategyChartSection>
    </>
  );
};
