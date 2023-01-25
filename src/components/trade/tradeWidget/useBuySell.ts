import { useWeb3 } from 'libs/web3';
import { useModal } from 'hooks/useModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { config } from 'services/web3/config';
import { useApproval } from 'hooks/useApproval';
import { PopulatedTransaction } from 'ethers';
import { sdk } from 'libs/sdk';
import BigNumber from 'bignumber.js';
import { TradeWidgetBuySellProps } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import {
  QueryKey,
  useQueryClient,
  useGetTradeLiquidity,
  useGetTradeData,
} from 'libs/queries';
import { prettifyNumber } from 'utils/helpers';
import { useNotifications } from 'hooks/useNotifications';
import { useStore } from 'store';

const calcMinReturn = (amount: string, slippagePercent: string | number) => {
  const slippage = new BigNumber(slippagePercent).div(100);
  return new BigNumber(1).minus(slippage).times(amount).toString();
};

const calcMaxInput = (amount: string, slippagePercent: string | number) => {
  const slippage = new BigNumber(slippagePercent).div(100);
  return new BigNumber(1).plus(slippage).times(amount).toString();
};

const calcDeadline = (value: string) => {
  const deadlineInMs = new BigNumber(value).times(60).times(1000);
  return deadlineInMs.plus(Date.now()).toString();
};

export const useBuySell = ({
  source,
  target,
  sourceBalanceQuery,
}: TradeWidgetBuySellProps) => {
  const {
    trade: {
      settings: { slippage, deadline },
    },
  } = useStore();
  const { dispatchNotification } = useNotifications();
  const cache = useQueryClient();
  const { user, signer } = useWeb3();
  const { openModal } = useModal();
  const [sourceInput, setSourceInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [isTradeBySource, setIsTradeBySource] = useState(true);
  const [tradeActions, setTradeActions] = useState<any[]>([]);
  const [rate, setRate] = useState('');
  const [isLiquidityError, setIsLiquidityError] = useState(false);
  const [isSourceEmptyError, setIsSourceEmptyError] = useState(false);
  const [isTargetEmptyError, setIsTargetEmptyError] = useState(false);

  const approvalTokens = useMemo(
    () => [
      {
        ...source,
        spender: config.carbon.poolCollection,
        amount: isTradeBySource
          ? sourceInput
          : calcMaxInput(sourceInput, slippage),
      },
    ],
    [source, sourceInput, slippage, isTradeBySource]
  );

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

  const liquidityQuery = useGetTradeLiquidity(source.address, target.address);

  const checkLiquidity = (value: string) => {
    const check = (v: string) => new BigNumber(v).times(0.9999).gt(value);
    const set = () => setIsLiquidityError(true);
    setIsLiquidityError(false);

    if (isTradeBySource) {
      if (check(sourceInput)) {
        setTargetInput('...');
        return set();
      }
    } else {
      if (check(targetInput)) {
        setSourceInput('...');
        return set();
      }
    }
  };

  const tradeAction = useCallback(async () => {
    if (!user || !signer) {
      throw new Error('No user or signer');
    }

    let unsignedTx: PopulatedTransaction;
    if (isTradeBySource) {
      unsignedTx = await sdk.composeTradeBySourceTransaction(
        source.address,
        target.address,
        tradeActions,
        calcDeadline(deadline),
        calcMinReturn(targetInput, slippage),
        { gasLimit: 999999999 }
      );
    } else {
      unsignedTx = await sdk.composeTradeByTargetTransaction(
        source.address,
        target.address,
        tradeActions,
        calcDeadline(deadline),
        calcMaxInput(sourceInput, slippage),
        { gasLimit: 999999999 }
      );
    }

    const tx = await signer.sendTransaction(unsignedTx);
    dispatchNotification('trade', {
      txHash: tx.hash,
      amount: sourceInput,
      from: source.symbol,
      to: target.symbol,
    });
    setSourceInput('');
    setTargetInput('');

    void cache.invalidateQueries(
      QueryKey.approval(user, source.address, config.carbon.poolCollection)
    );

    await tx.wait();
    void cache.invalidateQueries(QueryKey.balance(user, source.address));
    void cache.invalidateQueries(QueryKey.balance(user, target.address));
  }, [
    tradeActions,
    isTradeBySource,
    source,
    target,
    user,
    signer,
    cache,
    dispatchNotification,
    sourceInput,
    targetInput,
    deadline,
    slippage,
  ]);

  const onInputChange = (bySource: boolean) => {
    setIsTradeBySource(bySource);
    resetError();
  };

  useEffect(() => {
    if (bySourceQuery.data) {
      const {
        totalSourceAmount,
        totalTargetAmount,
        tradeActions,
        effectiveRate,
      } = bySourceQuery.data;

      setTargetInput(totalTargetAmount);
      setTradeActions(tradeActions);
      setRate(effectiveRate);
      checkLiquidity(totalSourceAmount);
    }
    // TODO depency array issues
    // eslint-disable-next-line
  }, [bySourceQuery.data]);

  useEffect(() => {
    if (byTargetQuery.data) {
      const {
        totalSourceAmount,
        totalTargetAmount,
        tradeActions,
        effectiveRate,
      } = byTargetQuery.data;

      setSourceInput(totalSourceAmount);
      setTradeActions(tradeActions);
      setRate(effectiveRate);
      checkLiquidity(totalTargetAmount);
    }
    // TODO depency array issues
    // eslint-disable-next-line
  }, [byTargetQuery.data]);

  useEffect(() => {
    setSourceInput('');
    setTargetInput('');
    resetError();
  }, [source.address, target.address]);

  const errorBaseBalanceSufficient =
    !!user && new BigNumber(sourceBalanceQuery.data || 0).lt(sourceInput);

  const handleCTAClick = useCallback(() => {
    if (
      bySourceQuery.isFetching ||
      byTargetQuery.isFetching ||
      approval.isLoading ||
      isLiquidityError ||
      errorBaseBalanceSufficient
    ) {
      return;
    }

    if (!sourceInput) {
      return setIsSourceEmptyError(true);
    }

    if (!targetInput) {
      return setIsTargetEmptyError(true);
    }

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
  }, [
    approval,
    tradeAction,
    user,
    openModal,
    approvalTokens,
    bySourceQuery,
    byTargetQuery,
    sourceInput,
    targetInput,
    errorBaseBalanceSufficient,
    isLiquidityError,
  ]);

  const resetError = () => {
    setIsSourceEmptyError(false);
    setIsTargetEmptyError(false);
    setIsLiquidityError(false);
  };

  const errorMsgSource = useMemo(() => {
    if (isSourceEmptyError) {
      return 'Please enter an amount';
    }

    if (errorBaseBalanceSufficient) {
      return 'Insufficient balance';
    }
  }, [errorBaseBalanceSufficient, isSourceEmptyError]);

  const errorMsgTarget = useMemo(() => {
    if (isTargetEmptyError) {
      return 'Please enter an amount';
    }
    if (isLiquidityError) {
      return `Available liquidity: ${prettifyNumber(
        liquidityQuery.data || '0'
      )} ${target.symbol}`;
    }
  }, [
    liquidityQuery.data,
    isLiquidityError,
    isTargetEmptyError,
    target.symbol,
  ]);

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
    liquidityQuery,
    isLiquidityError,
    errorMsgSource,
    errorMsgTarget,
  };
};
