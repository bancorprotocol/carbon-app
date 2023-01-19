import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';
import { Token } from 'libs/tokens';
import { UseQueryResult } from '@tanstack/react-query';
import { useBuySell } from 'components/trade/tradeWidget/useBuySell';
import { prettifyNumber } from 'utils/helpers';
import BigNumber from 'bignumber.js';

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

  if (!source || !target) return null;

  return (
    <div className={'rounded-12 bg-silver p-20'}>
      <h2 className={'mb-20'}>{buy ? 'Buy' : 'Sell'}</h2>
      <TokenInputField
        className={'mt-5 mb-20 rounded-12 bg-black p-16'}
        token={source}
        isBalanceLoading={false}
        value={sourceInput}
        setValue={setSourceInput}
        balance={sourceBalanceQuery.data}
        error={errorMsgSource}
        onKeystroke={() => onInputChange(true)}
        isLoading={byTargetQuery.isFetching}
      />

      <TokenInputField
        className={'mt-5 rounded-t-12 rounded-b-4 bg-black p-16'}
        token={target}
        title={'Total'}
        isBalanceLoading={false}
        value={targetInput}
        setValue={setTargetInput}
        placeholder={'Total Amount'}
        balance={targetBalanceQuery.data}
        onKeystroke={() => onInputChange(false)}
        isLoading={bySourceQuery.isFetching}
        error={errorMsgTarget}
        onErrorClick={() => {
          setTargetInput(liquidityQuery.data || '0');
          onInputChange(false);
        }}
      />
      <div
        className={
          'mt-5 rounded-b-12 rounded-t-4 bg-black p-16 font-mono text-14 text-white/80'
        }
      >
        {!rate ? (
          '...'
        ) : buy ? (
          <>
            1 {target.symbol} = {rate ? prettifyNumber(rate) : '--'}{' '}
            {source.symbol}
          </>
        ) : (
          <>
            1 {source.symbol} ={' '}
            {rate ? prettifyNumber(new BigNumber(1).div(rate)) : '--'}{' '}
            {target.symbol}
          </>
        )}
      </div>

      {liquidityQuery.data && (
        <div className={'text-secondary mt-5 text-right'}>
          Liquidity: {prettifyNumber(liquidityQuery.data)} {target.symbol}
        </div>
      )}

      <Button
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
