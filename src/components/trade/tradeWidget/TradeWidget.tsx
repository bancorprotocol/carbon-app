import { TradeWidgetBuySell } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useTradePairs } from 'components/trade/useTradePairs';
import { Button } from 'components/common/button';
import { useGetTokenBalance } from 'libs/queries';
import { useTradeTokens } from 'components/trade/useTradeTokens';

export const TradeWidget = () => {
  const { baseToken, quoteToken } = useTradeTokens();
  const { openTradePairList, isLoading, isTradePairError } = useTradePairs();

  const baseBalanceQuery = useGetTokenBalance(baseToken);
  const quoteBalanceQuery = useGetTokenBalance(quoteToken);

  const isValidPair = !(!baseToken || !quoteToken);

  const noTokens = !baseToken && !quoteToken;

  return (
    <>
      {isLoading ? (
        <div>is loading</div>
      ) : isTradePairError || !isValidPair ? (
        <div>
          {!noTokens && <div>Not found</div>}
          <Button onClick={openTradePairList}>Select Pair</Button>
        </div>
      ) : (
        <div className={'grid grid-cols-2 gap-20'}>
          <TradeWidgetBuySell
            buy
            source={quoteToken}
            target={baseToken}
            sourceBalanceQuery={quoteBalanceQuery}
            targetBalanceQuery={baseBalanceQuery}
          />
          <TradeWidgetBuySell
            source={baseToken}
            target={quoteToken}
            sourceBalanceQuery={baseBalanceQuery}
            targetBalanceQuery={quoteBalanceQuery}
          />
        </div>
      )}
    </>
  );
};
