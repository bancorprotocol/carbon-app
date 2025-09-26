import { useNavigate, useSearch } from '@tanstack/react-router';
import { MainMenuTradeSettings } from 'components/core/menu/mainMenu/MainMenuTradeSettings';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { TradeLayout } from 'components/trade/TradeLayout';
import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useGetTokenBalance } from 'libs/queries';
import { StrategyDirection } from 'libs/routing';
import { cn } from 'utils/helpers';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { PairChartHistory } from 'components/strategies/common/PairChartHistory';
import style from 'components/strategies/common/order.module.css';
import { OrderDirection } from 'components/strategies/common/OrderDirection';

const url = '/trade/market';
export const TradeMarket = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const isBuy = search.direction === 'buy';
  const balanceQuery = useGetTokenBalance(isBuy ? quote : base);

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
      <StrategyChartSection>
        <PairChartHistory base={base} quote={quote}>
          <TradeChartContent />
        </PairChartHistory>
      </StrategyChartSection>
      <TradeLayout>
        <article className="bg-white-gradient grid rounded-2xl overflow-clip">
          <OrderDirection
            direction={search.direction || 'sell'}
            setDirection={setDirection}
          />
          <div
            className={cn(style.order, 'grid gap-16 p-16')}
            data-direction={isBuy ? 'buy' : 'sell'}
          >
            <header className="flex items-center justify-between">
              <h2 className="text-18 flex items-center gap-8">
                {isBuy ? 'Buy' : 'Sell'} {base.symbol}&nbsp;
                {isBuy ? 'with' : 'for'} {quote.symbol}
              </h2>
              <MainMenuTradeSettings />
            </header>
            <TradeWidgetBuySell
              source={isBuy ? quote : base}
              target={isBuy ? base : quote}
              sourceBalanceQuery={balanceQuery}
              isBuy={isBuy}
              data-testid={isBuy ? 'buy-form' : 'sell-form'}
            />
          </div>
        </article>
      </TradeLayout>
    </>
  );
};
