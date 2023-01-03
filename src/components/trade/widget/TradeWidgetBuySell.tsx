import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';
import { Token } from 'libs/tokens';
import { useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

type Props = {
  baseToken: Token;
  quoteToken: Token;
  buy?: boolean;
  baseBalanceQuery: UseQueryResult<string>;
  quoteBalanceQuery: UseQueryResult<string>;
};
export const TradeWidgetBuySell = ({
  buy,
  baseToken,
  quoteToken,
  baseBalanceQuery,
  quoteBalanceQuery,
}: Props) => {
  const [baseInput, setBaseInput] = useState('');
  const [quoteInput, setQuoteInput] = useState('');

  const errorBaseBalanceSufficient =
    new BigNumber(baseBalanceQuery.data || 0).lt(baseInput) &&
    'Insufficient balance';

  if (!baseToken || !quoteToken) return null;

  return (
    <div>
      <TokenInputField
        className={'mt-5 rounded-12 bg-black p-16'}
        token={baseToken}
        isBalanceLoading={false}
        value={baseInput}
        setValue={setBaseInput}
        balance={baseBalanceQuery.data}
        error={errorBaseBalanceSufficient}
      />

      <div className={'mt-20 text-14 text-white/50'}>Total</div>
      <TokenInputField
        className={'mt-5 rounded-t-12 rounded-b-4 bg-black p-16'}
        token={quoteToken}
        isBalanceLoading={false}
        value={quoteInput}
        setValue={setQuoteInput}
        balance={quoteBalanceQuery.data}
      />
      <div
        className={
          'mt-5 rounded-b-12 rounded-t-4 bg-black p-16 font-mono text-14 text-white/80'
        }
      >
        1 ETH = 1,197.770 USDT
      </div>
      <Button variant={buy ? 'success' : 'error'} fullWidth className={'mt-20'}>
        {buy ? 'Buy' : 'Sell'}
      </Button>
    </div>
  );
};
