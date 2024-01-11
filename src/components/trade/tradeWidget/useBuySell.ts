import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { carbonEvents } from 'services/events';
import { useWeb3 } from 'libs/web3';
import {
  useGetTradeLiquidity,
  useGetTradeData,
  useGetMaxSourceAmountByPair,
  useGetTokenPrice,
} from 'libs/queries';
import { Action, TradeActionBNStr, MatchActionBNStr } from 'libs/sdk';
import { useModal } from 'hooks/useModal';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { TradeWidgetBuySellProps } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useTradeAction } from 'components/trade/tradeWidget/useTradeAction';
import { prettifyNumber } from 'utils/helpers';

export const useBuySell = ({
  source,
  target,
  sourceBalanceQuery,
  buy = false,
}: TradeWidgetBuySellProps) => {
  const { user, provider } = useWeb3();
  const { openModal } = useModal();
  const { selectedFiatCurrency } = useFiatCurrency();
  const sourceTokenPriceQuery = useGetTokenPrice(source.address);
  const targetTokenPriceQuery = useGetTokenPrice(target.address);
  const [sourceInput, setSourceInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [isTradeBySource, setIsTradeBySource] = useState(true);
  const [tradeActions, setTradeActions] = useState<TradeActionBNStr[]>([]);
  const [tradeActionsRes, setTradeActionsRes] = useState<Action[]>([]);
  const [tradeActionsWei, setTradeActionsWei] = useState<MatchActionBNStr[]>(
    []
  );
  const [rate, setRate] = useState('');
  const [isLiquidityError, setIsLiquidityError] = useState(false);
  const [isSourceEmptyError, setIsSourceEmptyError] = useState(false);
  const [isTargetEmptyError, setIsTargetEmptyError] = useState(false);
  const [isAwaiting, setIsAwaiting] = useState(false);

  const { calcMaxInput } = useTradeAction({
    source,
    isTradeBySource,
    sourceInput,
  });
  const maxSourceAmountQuery = useGetMaxSourceAmountByPair(
    source.address,
    target.address
  );

  const { getFiatValue: getFiatValueSource } = useFiatCurrency(source);

  const clearInputs = useCallback(() => {
    setSourceInput('');
    setTargetInput('');
  }, []);

  const eventData = useMemo(() => {
    return {
      buy,
      buyToken: target,
      sellToken: source,
      blockchainNetwork: provider?.network?.name || '',
      valueUsd: getFiatValueSource(sourceInput, true).toString(),
    };
  }, [
    buy,
    getFiatValueSource,
    provider?.network?.name,
    source,
    sourceInput,
    target,
  ]);

  const { trade, approval } = useTradeAction({
    source,
    sourceInput,
    isTradeBySource,
    onSuccess: (txHash: string) => {
      setIsAwaiting(false);
      clearInputs();
      buy
        ? carbonEvents.trade.tradeBuy({
            ...eventData,
            transactionHash: txHash,
          })
        : carbonEvents.trade.tradeSell({
            ...eventData,
            transactionHash: txHash,
          });
    },
  });

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

  const checkLiquidity = () => {
    const checkSource = () =>
      new SafeDecimal(sourceInput).gt(maxSourceAmountQuery.data || 0);

    const checkTarget = () =>
      new SafeDecimal(targetInput).gt(liquidityQuery.data || 0);

    const set = () => setIsLiquidityError(true);
    setIsLiquidityError(false);

    if (isTradeBySource) {
      if (checkSource()) {
        setTargetInput('...');
        return set();
      }
    } else {
      if (checkTarget()) {
        setSourceInput('...');
        return set();
      }
    }
  };

  const onInputChange = (bySource: boolean) => {
    setIsTradeBySource(bySource);
    resetError();
  };

  useEffect(() => {
    if (bySourceQuery.data) {
      const {
        totalTargetAmount,
        tradeActions,
        actionsTokenRes,
        effectiveRate,
        actionsWei,
      } = bySourceQuery.data;

      setTargetInput(totalTargetAmount);
      setTradeActions(tradeActions);
      setTradeActionsRes(actionsTokenRes);
      setTradeActionsWei(actionsWei);
      setRate(effectiveRate);
      if (effectiveRate !== '0') {
        checkLiquidity();
      }
    }
    // eslint-disable-next-line
  }, [bySourceQuery.data]);

  useEffect(() => {
    if (byTargetQuery.data) {
      const {
        totalSourceAmount,
        tradeActions,
        actionsTokenRes,
        effectiveRate,
        actionsWei,
      } = byTargetQuery.data;

      setSourceInput(totalSourceAmount);
      setTradeActions(tradeActions);
      setTradeActionsRes(actionsTokenRes);
      setTradeActionsWei(actionsWei);
      setRate(effectiveRate);
      if (effectiveRate !== '0') {
        checkLiquidity();
      }
    }
    // eslint-disable-next-line
  }, [byTargetQuery.data]);

  useEffect(() => {
    setSourceInput('');
    setTargetInput('');
    resetError();
  }, [source.address, target.address]);

  const errorBaseBalanceSufficient =
    !!user &&
    new SafeDecimal(sourceBalanceQuery.data || 0).lt(
      isTradeBySource ? sourceInput : calcMaxInput(sourceInput)
    );

  const handleCTAClick = useCallback(() => {
    if (!user) {
      return openModal('wallet', undefined);
    }

    if (
      bySourceQuery.isFetching ||
      byTargetQuery.isFetching ||
      approval.isLoading ||
      isLiquidityError ||
      errorBaseBalanceSufficient ||
      maxSourceAmountQuery.isFetching
    ) {
      return;
    }

    if (!sourceInput) {
      return setIsSourceEmptyError(true);
    }

    if (!targetInput) {
      return setIsTargetEmptyError(true);
    }

    const tradeFn = async () =>
      await trade({
        source,
        target,
        tradeActions,
        isTradeBySource,
        sourceInput: sourceInput,
        targetInput: targetInput,
        setIsAwaiting,
      });

    if (approval.approvalRequired) {
      openModal('txConfirm', {
        approvalTokens: approval.tokens,
        onConfirm: () => {
          setIsAwaiting(true);
          tradeFn();
        },
        buttonLabel: 'Confirm Trade',
        eventData: {
          ...eventData,
          productType: 'trade',
          approvalTokens: approval.tokens,
          blockchainNetwork: provider?.network?.name || '',
        },
        context: 'trade',
      });
    } else {
      setIsAwaiting(true);
      void tradeFn();
    }
  }, [
    approval.approvalRequired,
    approval.isLoading,
    approval.tokens,
    bySourceQuery.isFetching,
    byTargetQuery.isFetching,
    errorBaseBalanceSufficient,
    eventData,
    isLiquidityError,
    isTradeBySource,
    provider?.network?.name,
    maxSourceAmountQuery.isFetching,
    openModal,
    source,
    sourceInput,
    target,
    targetInput,
    trade,
    tradeActions,
    user,
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
    isTargetEmptyError,
    isLiquidityError,
    liquidityQuery.data,
    target.symbol,
  ]);

  const openTradeRouteModal = useCallback(() => {
    openModal('tradeRouting', {
      sourceBalance: sourceBalanceQuery.data ?? '0',
      tradeActionsWei,
      tradeActionsRes,
      source,
      target,
      isTradeBySource,
      onSuccess: clearInputs,
      buy,
    });
  }, [
    buy,
    clearInputs,
    isTradeBySource,
    openModal,
    source,
    target,
    tradeActionsRes,
    tradeActionsWei,
    sourceBalanceQuery,
  ]);

  const getTokenFiat = useCallback(
    (value: string, query: any) => {
      return new SafeDecimal(value || 0).times(
        query.data?.[selectedFiatCurrency] || 0
      );
    },
    [selectedFiatCurrency]
  );

  const calcSlippage = useCallback((): SafeDecimal | null => {
    const sourceFiat = getTokenFiat(sourceInput, sourceTokenPriceQuery);
    const targetFiat = getTokenFiat(targetInput, targetTokenPriceQuery);

    if (sourceFiat.isZero() || targetFiat.isZero()) {
      return new SafeDecimal(0);
    }
    const diff = targetFiat.div(sourceFiat);
    const slippage = diff.minus(new SafeDecimal(1)).times(100);

    if (slippage.isFinite()) {
      return slippage;
    }
    return null;
  }, [
    getTokenFiat,
    sourceInput,
    sourceTokenPriceQuery,
    targetInput,
    targetTokenPriceQuery,
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
    openTradeRouteModal,
    calcSlippage,
    isTradeBySource,
    maxSourceAmountQuery,
    isAwaiting,
  };
};
