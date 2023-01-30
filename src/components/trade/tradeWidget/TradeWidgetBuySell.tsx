import { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';
import { useBuySell } from 'components/trade/tradeWidget/useBuySell';
import { Token } from 'libs/tokens';
import { prettifyNumber } from 'utils/helpers';
import { NotEnoughLiquidity } from './NotEnoughLiquidity';

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
  const { buy, source, target, sourceBalanceQuery, targetBalanceQuery } = props;
  const hasEnoughLiquidity = +liquidityQuery?.data! > 0;

  if (liquidityQuery?.isLoading) return <div>Loading</div>;
  if (liquidityQuery?.isError) return <div>Error</div>;
  if (!source || !target || !liquidityQuery?.data) return null;

  const getRate = () => {
    if (!rate) return '...';

    if (buy) {
      return `
          1 ${target.symbol} = ${rate ? prettifyNumber(rate) : '--'}
          ${source.symbol}
        `;
    } else {
      return `1 ${source.symbol} =
        ${rate ? prettifyNumber(new BigNumber(1).div(rate)) : '--'}
        ${target.symbol}`;
    }
  };

  return (
    <div className={`flex flex-col rounded-12 bg-silver p-20`}>
      <h2 className={'mb-20'}>{buy ? 'Buy' : 'Sell'}</h2>
      <div className={'flex justify-between text-14'}>
        <div className={'text-white/50'}>Amount</div>
        {errorMsgSource && (
          <div className={`font-weight-500 text-red`}>{errorMsgSource}</div>
        )}
      </div>
      {hasEnoughLiquidity ? (
        <>
          <TokenInputField
            className={'mt-5 mb-20 rounded-12 bg-black p-16'}
            token={source}
            isBalanceLoading={false}
            value={sourceInput}
            setValue={setSourceInput}
            balance={sourceBalanceQuery.data}
            onKeystroke={() => onInputChange(true)}
            isLoading={byTargetQuery.isFetching}
            isError={!!errorMsgSource}
          />
          <div className={'flex justify-between text-14'}>
            <div className={'text-white/50'}>Amount</div>
            {errorMsgTarget && (
              <div
                className={`cursor-pointer font-weight-500 text-red`}
                onClick={() => {
                  setTargetInput(liquidityQuery.data || '0');
                  onInputChange(false);
                }}
              >
                {errorMsgTarget}
              </div>
            )}
          </div>
          <TokenInputField
            className={'mt-5 rounded-t-12 rounded-b-4 bg-black p-16'}
            token={target}
            isBalanceLoading={false}
            value={targetInput}
            setValue={setTargetInput}
            placeholder={'Total Amount'}
            balance={targetBalanceQuery.data}
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
          {liquidityQuery.data && (
            <div className={'text-secondary mt-5 text-right'}>
              Liquidity: {prettifyNumber(liquidityQuery.data)} {target.symbol}
            </div>
          )}
        </>
      ) : (
        <NotEnoughLiquidity source={source} target={target} />
      )}
      <Button
        disabled={!hasEnoughLiquidity}
        onClick={handleCTAClick}
        variant={buy ? 'success' : 'error'}
        fullWidth
        className={'mt-20'}
      >
        {buy ? 'Buy' : 'Sell'}
      </Button>
    </div>
  );
};
