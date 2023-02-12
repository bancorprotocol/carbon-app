import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useGetTokenBalance } from 'libs/queries';
import { TradePageProps } from 'pages/trade';

export const TradeWidget = ({ base, quote }: TradePageProps) => {
  const baseBalanceQuery = useGetTokenBalance(base);
  const quoteBalanceQuery = useGetTokenBalance(quote);

  return (
    <>
      <div className={'grid grid-cols-1 gap-20 md:grid-cols-2'}>
        <TradeWidgetBuySell
          buy
          source={quote}
          target={base}
          sourceBalanceQuery={quoteBalanceQuery}
          targetBalanceQuery={baseBalanceQuery}
        />
        <TradeWidgetBuySell
          source={base}
          target={quote}
          sourceBalanceQuery={baseBalanceQuery}
          targetBalanceQuery={quoteBalanceQuery}
        />
      </div>
    </>
  );
};
