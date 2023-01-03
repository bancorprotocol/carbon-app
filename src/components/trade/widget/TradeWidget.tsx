import { TradeWidgetBuySell } from 'components/trade/widget/TradeWidgetBuySell';
import { useTrade } from 'components/trade/useTrade';
import { Button } from 'components/common/button';
import { useGetTokenBalance } from 'libs/queries';

export const TradeWidget = () => {
  const {
    baseToken,
    quoteToken,
    openTradePairList,
    isLoading,
    isTradePairError,
  } = useTrade();

  const baseBalanceQuery = useGetTokenBalance(baseToken);
  const quoteBalanceQuery = useGetTokenBalance(quoteToken);

  const isValidPair = !(!baseToken || !quoteToken);

  const noTokens = !baseToken && !quoteToken;

  return (
    <div className={'rounded-12 bg-silver p-10'}>
      <div className={'flex justify-between'}>
        <h2>Trade</h2>
        <div>settings</div>
      </div>

      {isLoading ? (
        <div>is loading</div>
      ) : isTradePairError || !isValidPair ? (
        <div>
          {!noTokens && <div>Not found</div>}
          <Button onClick={openTradePairList}>select pair</Button>
        </div>
      ) : (
        <div className={'grid grid-cols-2 gap-20'}>
          <TradeWidgetBuySell
            buy
            baseToken={baseToken}
            quoteToken={quoteToken}
            baseBalanceQuery={baseBalanceQuery}
            quoteBalanceQuery={quoteBalanceQuery}
          />
          <TradeWidgetBuySell
            baseToken={quoteToken}
            quoteToken={baseToken}
            baseBalanceQuery={quoteBalanceQuery}
            quoteBalanceQuery={baseBalanceQuery}
          />
        </div>
      )}
    </div>
  );
};
