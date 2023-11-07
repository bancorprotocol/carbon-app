import { useState } from 'react';
import { carbonEvents } from 'services/events';
import { useGetTokenBalance } from 'libs/queries';
import useInitEffect from 'hooks/useInitEffect';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { TradePageProps } from 'pages/trade';
import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';

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
      <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
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
            data-testid="buy-form"
          />
        )}

        {(currentBreakpoint !== 'sm' || !mobileShowBuy) && (
          <TradeWidgetBuySell
            source={base}
            target={quote}
            sourceBalanceQuery={baseBalanceQuery}
            data-testid="sell-form"
          />
        )}
      </div>
    </>
  );
};
