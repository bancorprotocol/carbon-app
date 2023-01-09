import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';
import { Token } from 'libs/tokens';
import { useEffect, useMemo, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useGetTradeData } from 'libs/queries/sdk/trade';

type Props = {
  source: Token;
  target: Token;
  buy?: boolean;
  sourceBalanceQuery: UseQueryResult<string>;
  targetBalanceQuery: UseQueryResult<string>;
};
export const TradeWidgetBuySell = ({
  buy,
  source,
  target,
  sourceBalanceQuery,
  targetBalanceQuery,
}: Props) => {
  const [sourceInput, setSourceInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [isTradeBySource, setIsTradeBySource] = useState(true);

  const dataQuery = useGetTradeData({
    sourceToken: source.address,
    targetToken: target.address,
    isTradeBySource,
    input: isTradeBySource ? sourceInput : targetInput,
  });

  const rate = useMemo(
    () => new BigNumber(targetInput).div(sourceInput).toString(),
    [sourceInput, targetInput]
  );

  useEffect(() => {
    const output = dataQuery.data;
    if (typeof output === 'string') {
      if (isTradeBySource) {
        setTargetInput(output);
      } else {
        setSourceInput(output);
      }
    }
  }, [dataQuery.data, isTradeBySource]);

  const errorBaseBalanceSufficient =
    new BigNumber(sourceBalanceQuery.data || 0).lt(sourceInput) &&
    'Insufficient balance';

  if (!source || !target) return null;

  return (
    <div>
      <TokenInputField
        className={'mt-5 rounded-12 bg-black p-16'}
        token={source}
        isBalanceLoading={false}
        value={sourceInput}
        setValue={setSourceInput}
        balance={sourceBalanceQuery.data}
        error={errorBaseBalanceSufficient}
        onKeystroke={() => setIsTradeBySource(true)}
        isLoading={isTradeBySource ? false : dataQuery.isFetching}
      />

      <div className={'mt-20 text-14 text-white/50'}>Total</div>
      <TokenInputField
        className={'mt-5 rounded-t-12 rounded-b-4 bg-black p-16'}
        token={target}
        isBalanceLoading={false}
        value={targetInput}
        setValue={setTargetInput}
        balance={targetBalanceQuery.data}
        onKeystroke={() => setIsTradeBySource(false)}
        isLoading={isTradeBySource ? dataQuery.isFetching : false}
      />
      <div
        className={
          'mt-5 rounded-b-12 rounded-t-4 bg-black p-16 font-mono text-14 text-white/80'
        }
      >
        {dataQuery.isFetching ? (
          'Loading...'
        ) : (
          <>
            1 {source.symbol} = {rate} {target.symbol}
          </>
        )}
      </div>
      <Button variant={buy ? 'success' : 'error'} fullWidth className={'mt-20'}>
        {buy ? 'Buy' : 'Sell'}
      </Button>
    </div>
  );
};
