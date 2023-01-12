import { useWeb3 } from 'libs/web3';
import { useModal } from 'libs/modals';
import { useEffect, useMemo, useState } from 'react';
import { config } from 'services/web3/config';
import { useApproval } from 'hooks/useApproval';
import { useGetTradeData } from 'libs/queries/sdk/trade';
import { PopulatedTransaction } from 'ethers';
import { sdk } from 'libs/sdk';
import BigNumber from 'bignumber.js';
import { TradeWidgetBuySellProps } from 'components/trade/tradeWidget/TradeWidgetBuySell';

export const useBuySell = ({
  source,
  target,
  sourceBalanceQuery,
  targetBalanceQuery,
}: TradeWidgetBuySellProps) => {
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

  return {
    sourceInput,
    setSourceInput,
    targetInput,
    setTargetInput,
    rate,
    onInputChange,
    handleCTAClick,
    errorBaseBalanceSufficient,
    bySourceQuery,
    byTargetQuery,
    approval,
  };
};
