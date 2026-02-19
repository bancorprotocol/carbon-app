import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { MainMenuTradeSettings } from 'components/core/menu/mainMenu/MainMenuTradeSettings';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { useTradeCtx } from 'components/trade/context';
import { TradeLayout } from 'components/trade/TradeLayout';
import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useGetTokenBalance } from 'libs/queries';
import { NewTabLink, StrategyDirection } from 'libs/routing';
import { cn } from 'utils/helpers';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { PairChartHistory } from 'components/strategies/common/PairChartHistory';
import { OrderDirection } from 'components/strategies/common/OrderDirection';
import style from 'components/strategies/common/order.module.css';
import config from 'config';

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
        <article className="surface grid rounded-2xl overflow-clip">
          <OrderDirection
            direction={search.direction || 'sell'}
            setDirection={setDirection}
          />
          <div
            className={cn(style.order, 'grid gap-16 p-16')}
            data-direction={isBuy ? 'buy' : 'sell'}
            data-disposable={true}
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
          {config.ui.useOpenocean && (
            <p className="text-center text-10 py-8">
              Powered by{' '}
              <NewTabLink to="https://openocean.finance/" className="font-bold">
                OpenOcean
              </NewTabLink>
            </p>
          )}
        </article>
        <Link
          from="/trade/market"
          to="../disposable"
          search={(s) => ({ base: s.base, quote: s.quote, settings: 'limit' })}
          className="grid gap-8 p-16 text-center border-gradient rounded-2xl"
        >
          <h3 className="text-gradient">Your Price. Your Rules.</h3>
          <p className="text-14 font-medium">
            Set a Limit Order to buy or sell exactly where you want.
          </p>
          <p className="text-gradient">Click here to create a Limit Order</p>
        </Link>
      </TradeLayout>
    </>
  );
};
