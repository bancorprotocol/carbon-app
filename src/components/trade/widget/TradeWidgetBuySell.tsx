import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';
import { Token } from 'libs/tokens';
import { useEffect, useMemo, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useGetTradeData } from 'libs/queries/sdk/trade';
import { useWeb3 } from 'libs/web3';
import { useModal } from 'libs/modals';
import { useApproval } from 'hooks/useApproval';
import { config } from 'services/web3/config';
import { sdk } from 'libs/sdk';
import { PopulatedTransaction } from 'ethers';

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
  const { user, signer } = useWeb3();
  const { openModal } = useModal();
  const [sourceInput, setSourceInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [isTradeBySource, setIsTradeBySource] = useState(true);
  const [tradeActions, setTradeActions] = useState<any[]>([]);
  const approvalTokens = [
    { ...source, spender: config.carbon.poolCollection, amount: sourceInput },
  ];
  const approval = useApproval(approvalTokens);

  const bySourceQuery = useGetTradeData({
    sourceToken: source.address,
    targetToken: target.address,
    isTradeBySource: true,
    input: sourceInput,
    enabled: isTradeBySource,
  });

  const byTargetQuery = useGetTradeData({
    sourceToken: source.address,
    targetToken: target.address,
    isTradeBySource: false,
    input: targetInput,
    enabled: !isTradeBySource,
  });

  const tradeAction = async () => {
    if (!user || !signer) {
      throw new Error('No user or signer');
    }
    console.log(1);
    let unsignedTx: PopulatedTransaction;
    if (isTradeBySource) {
      unsignedTx = await sdk.composeTradeBySourceTransaction(
        source.address,
        target.address,
        tradeActions,
        0,
        0,
        { gasLimit: 999999999 }
      );
    } else {
      unsignedTx = await sdk.composeTradeByTargetTransaction(
        source.address,
        target.address,
        tradeActions,
        0,
        0,
        { gasLimit: 999999999 }
      );
    }

    console.log(2);
    const tx = await signer.sendTransaction(unsignedTx);
    await tx.wait();
    void sourceBalanceQuery.refetch();
    void targetBalanceQuery.refetch();
    console.log(3);
    console.log('tradeAction tx', tx);
  };

  const handleCTAClick = () => {
    if (!user) {
      openModal('wallet', undefined);
    } else if (approval.approvalRequired) {
      openModal('txConfirm', {
        approvalTokens,
        onConfirm: tradeAction,
        buttonLabel: 'Confirm Trade',
      });
    } else {
      tradeAction();
    }
  };

  const onInputChange = (bySource: boolean) => {
    setIsTradeBySource(bySource);
    console.log('onInputChange', sourceInput);
  };

  const rate = useMemo(
    () => new BigNumber(targetInput).div(sourceInput).toString(),
    [sourceInput, targetInput]
  );

  useEffect(() => {
    if (bySourceQuery.data) {
      const { totalOutput, tradeActions } = bySourceQuery.data;

      setTargetInput(totalOutput);
      setTradeActions(tradeActions);
    }
  }, [bySourceQuery.data]);

  useEffect(() => {
    if (byTargetQuery.data) {
      const { totalOutput, tradeActions } = byTargetQuery.data;

      setSourceInput(totalOutput);
      setTradeActions(tradeActions);
    }
  }, [byTargetQuery.data]);

  useEffect(() => {
    setSourceInput('');
    setTargetInput('');
  }, [source.address, target.address]);

  const errorBaseBalanceSufficient =
    !!user &&
    new BigNumber(sourceBalanceQuery.data || 0).lt(sourceInput) &&
    'Insufficient balance';

  if (!source || !target) return null;

  return (
    <div className={'pt-20'}>
      <TokenInputField
        className={'mt-5 mb-20 rounded-12 bg-black p-16'}
        token={source}
        isBalanceLoading={false}
        value={sourceInput}
        setValue={setSourceInput}
        balance={sourceBalanceQuery.data}
        error={errorBaseBalanceSufficient}
        onKeystroke={() => onInputChange(true)}
        isLoading={byTargetQuery.isFetching}
      />

      <TokenInputField
        className={'mt-5 rounded-t-12 rounded-b-4 bg-black p-16'}
        token={target}
        isBalanceLoading={false}
        value={targetInput}
        setValue={setTargetInput}
        balance={targetBalanceQuery.data}
        onKeystroke={() => onInputChange(false)}
        isLoading={bySourceQuery.isFetching}
      />
      <div
        className={
          'mt-5 rounded-b-12 rounded-t-4 bg-black p-16 font-mono text-14 text-white/80'
        }
      >
        {bySourceQuery.isFetching || byTargetQuery.isFetching ? (
          'Loading...'
        ) : (
          <>
            1 {source.symbol} = {rate} {target.symbol}
          </>
        )}
      </div>
      <Button
        onClick={handleCTAClick}
        disabled={
          !!errorBaseBalanceSufficient ||
          !sourceInput ||
          !targetInput ||
          bySourceQuery.isFetching ||
          byTargetQuery.isFetching ||
          approval.isLoading
        }
        variant={buy ? 'success' : 'error'}
        fullWidth
        className={'mt-20'}
      >
        {buy ? 'Buy' : 'Sell'}
      </Button>
    </div>
  );
};
