import BigNumber from 'bignumber.js';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';
import { useBuySell } from 'components/trade/tradeWidget/useBuySell';
import { NotEnoughLiquidity } from './NotEnoughLiquidity';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';
import { prettifyNumber } from 'utils/helpers';

export type TradeWidgetBuySellProps = {
  source: Token;
  target: Token;
  buy?: boolean;
  sourceBalanceQuery: UseQueryResult<string>;
  targetBalanceQuery: UseQueryResult<string>;
};

export const TradeWidgetBuySell = (props: TradeWidgetBuySellProps) => {
  const {
    sourceInput,
    setSourceInput,
    targetInput,
    setTargetInput,
    rate,
    onInputChange,
    handleCTAClick,
    bySourceQuery,
    byTargetQuery,
    liquidityQuery,
    errorMsgSource,
    errorMsgTarget,
  } = useBuySell(props);
  const { buy, source, target, sourceBalanceQuery } = props;
  const hasEnoughLiquidity = +liquidityQuery?.data! > 0;

  if (liquidityQuery?.isError) return <div>Error</div>;
  if (!source || !target) return null;

  const getRate = () => {
    if (!rate) return '...';

    if (buy) {
      return `1 ${target.symbol} = ${
        rate ? prettifyNumber(new BigNumber(1).div(rate)) : '--'
      } ${source.symbol}`;
    }
    return `1 ${source.symbol} =
        ${rate ? prettifyNumber(rate) : '--'}
        ${target.symbol}`;
  };

  const getLiquidty = () => {
    const value = liquidityQuery.isLoading
      ? 'loading'
      : prettifyNumber(liquidityQuery.data);
    return `Liquidity: ${value} ${target.symbol}`;
  };

  return (
    <div className={`flex flex-col rounded-12 bg-silver p-20`}>
      <h2 className={'mb-20'}>
        {buy
          ? `Buy ${target.symbol} with ${source.symbol}`
          : `Sell ${source.symbol} for ${target.symbol}`}
      </h2>
      <div className={'flex justify-between text-14'}>
        <div className={'text-white/50'}>You pay</div>
        {errorMsgSource && (
          <div className={`font-weight-500 text-red`}>{errorMsgSource}</div>
        )}
      </div>
      {hasEnoughLiquidity || liquidityQuery.isLoading ? (
        <>
          <TokenInputField
            className={'mt-5 mb-20 rounded-12 bg-black p-16'}
            token={source}
            isBalanceLoading={sourceBalanceQuery.isLoading}
            value={sourceInput}
            setValue={setSourceInput}
            balance={sourceBalanceQuery.data}
            onKeystroke={() => onInputChange(true)}
            isLoading={byTargetQuery.isFetching}
            isError={!!errorMsgSource}
          />
          <div className={'flex justify-between text-14'}>
            <div className={'text-white/50'}>You receive</div>
            {errorMsgTarget && (
              <div
                className={`cursor-pointer font-weight-500 text-red`}
                onClick={() => {
                  onInputChange(false);
                  setTargetInput(liquidityQuery.data || '0');
                }}
              >
                {errorMsgTarget}
              </div>
            )}
          </div>
          <TokenInputField
            className={'mt-5 rounded-t-12 rounded-b-4 bg-black p-16'}
            token={target}
            value={targetInput}
            setValue={setTargetInput}
            placeholder={'Total Amount'}
            onKeystroke={() => onInputChange(false)}
            isLoading={bySourceQuery.isFetching}
            isError={!!errorMsgTarget}
          />
          <div
            className={
              'mt-5 rounded-b-12 rounded-t-4 bg-black p-16 font-mono text-14 text-white/80'
            }
          >
            {getRate()}
          </div>

          <div className={'text-secondary mt-5 text-right'}>
            {getLiquidty()}
          </div>
        </>
      ) : (
        <NotEnoughLiquidity
          source={buy ? target : source}
          target={buy ? source : target}
        />
      )}
      <Button
        disabled={!hasEnoughLiquidity}
        onClick={handleCTAClick}
        variant={buy ? 'success' : 'error'}
        fullWidth
        className={'mt-20'}
      >
        {buy ? `Buy ${target.symbol}` : `Sell ${source.symbol}`}
      </Button>
    </div>
  );
};
