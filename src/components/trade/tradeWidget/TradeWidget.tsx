import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import useInitEffect from 'hooks/useInitEffect';
import { useGetTokenBalance } from 'libs/queries';
import { TradePageProps } from 'pages/trade';
import { carbonEvents } from 'services/events';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { useState } from 'react';

export const TradeWidget = ({ base, quote }: TradePageProps) => {
  const { currentBreakpoint } = useBreakpoints();
  const baseBalanceQuery = useGetTokenBalance(base);
  const quoteBalanceQuery = useGetTokenBalance(quote);
  const [mobileShowBuy, setMobileShowBuy] = useState(true);

  useInitEffect(() => {
    carbonEvents.trade.tradePairChange({
      buyToken: base,
      sellToken: quote,
    });
  }, [base, quote]);

  return (
    <>
      <div className={'grid grid-cols-1 gap-20 md:grid-cols-2'}>
        {currentBreakpoint === 'sm' && (
          <TabsMenu>
            <TabsMenuButton
              onClick={() => setMobileShowBuy(true)}
              isActive={mobileShowBuy}
            >
              Buy
            </TabsMenuButton>
            <TabsMenuButton
              onClick={() => setMobileShowBuy(false)}
              isActive={!mobileShowBuy}
            >
              Sell
            </TabsMenuButton>
          </TabsMenu>
        )}

        {(currentBreakpoint !== 'sm' || mobileShowBuy) && (
          <TradeWidgetBuySell
            buy
            source={quote}
            target={base}
            sourceBalanceQuery={quoteBalanceQuery}
            targetBalanceQuery={baseBalanceQuery}
          />
        )}

        {(currentBreakpoint !== 'sm' || !mobileShowBuy) && (
          <TradeWidgetBuySell
            source={base}
            target={quote}
            sourceBalanceQuery={baseBalanceQuery}
            targetBalanceQuery={quoteBalanceQuery}
          />
        )}
      </div>
    </>
  );
};
