import { useWeb3 } from 'libs/web3';
import { useModal } from 'hooks/useModal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { TradeWidgetBuySellProps } from 'components/trade/tradeWidget/TradeWidgetBuySell';
import { useGetTradeLiquidity, useGetTradeData } from 'libs/queries';
import { prettifyNumber } from 'utils/helpers';
import { Action, TradeActionStruct } from 'libs/sdk';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useGetTokenPrice } from 'libs/queries/extApi/tokenPrice';
import { useTradeAction } from 'components/trade/tradeWidget/useTradeAction';
import { SerializableMatchAction } from '@bancor/carbon-sdk/src/types';
import { sendEvent } from 'services/googleTagManager';

export const useBuySell = ({
  source,
  target,
  sourceBalanceQuery,
  buy,
}: TradeWidgetBuySellProps) => {
  const { user, provider } = useWeb3();
  const { openModal } = useModal();
  const { selectedFiatCurrency } = useFiatCurrency();
  const sourceTokenPriceQuery = useGetTokenPrice(source.symbol);
  const targetTokenPriceQuery = useGetTokenPrice(target.symbol);
  const [sourceInput, setSourceInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [isTradeBySource, setIsTradeBySource] = useState(true);
  const [tradeActions, setTradeActions] = useState<TradeActionStruct[]>([]);
  const [tradeActionsRes, setTradeActionsRes] = useState<Action[]>([]);
  const [tradeActionsWei, setTradeActionsWei] = useState<
    SerializableMatchAction[]
  >([]);
  const [rate, setRate] = useState('');
  const [isLiquidityError, setIsLiquidityError] = useState(false);
  const [isSourceEmptyError, setIsSourceEmptyError] = useState(false);
  const [isTargetEmptyError, setIsTargetEmptyError] = useState(false);

  const { getFiatValue: getFiatValueSource } = useFiatCurrency(source);
  const { getFiatValue: getFiatValueTarget } = useFiatCurrency(target);

  const clearInputs = useCallback(() => {
    setSourceInput('');
    setTargetInput('');
  }, []);

  const { trade, approval } = useTradeAction({
    source,
    sourceInput,
    isTradeBySource,
    onSuccess: (txHash: string) => {
      clearInputs();
      sendEvent('trade', buy ? 'trade_buy' : 'trade_sell', {
        trade_direction: buy ? 'buy' : 'sell',
        buy_token: target.symbol,
        sell_token: source.symbol,
        token_pair: `${target.symbol}/${source.symbol}`,
        blockchain_network: provider?.network.name,
        transaction_hash: txHash,
        value_usd: isTradeBySource
          ? getFiatValueSource(sourceInput, true).toString()
          : getFiatValueTarget(targetInput, true).toString(),
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

  const checkLiquidity = (value: string) => {
    const check = (v: string) => {
      if (v === '' || v === '...') {
        return false;
      }

      return !new BigNumber(v).eq(value);
    };

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
        checkLiquidity(totalSourceAmount);
      }
    }
    // eslint-disable-next-line
  }, [bySourceQuery.data]);

  useEffect(() => {
    if (byTargetQuery.data) {
      if (new BigNumber(targetInput).gt(liquidityQuery.data || 0)) {
        setIsLiquidityError(true);
        setSourceInput('...');
        return;
      }

      const {
        totalSourceAmount,
        totalTargetAmount,
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
        checkLiquidity(totalTargetAmount);
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
    !!user && new BigNumber(sourceBalanceQuery.data || 0).lt(sourceInput);

  const handleCTAClick = useCallback(() => {
    if (!user) {
      return openModal('wallet', undefined);
    }

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

    const tradeFn = async () =>
      await trade({
        source,
        target,
        tradeActions,
        isTradeBySource,
        sourceInput: sourceInput,
        targetInput: targetInput,
      });

    if (approval.approvalRequired) {
      openModal('txConfirm', {
        approvalTokens: approval.tokens,
        onConfirm: tradeFn,
        buttonLabel: 'Confirm Trade',
        eventData: {
          trade_direction: buy ? 'buy' : 'sell',
          buy_token: target.symbol,
          sell_token: source.symbol,
          token_pair: `${target.symbol}/${source.symbol}`,
          blockchain_network: provider?.network.name,
          value_usd: isTradeBySource
            ? getFiatValueSource(sourceInput, true).toString()
            : getFiatValueTarget(targetInput, true).toString(),
        },
      });
    } else {
      void tradeFn();
    }
  }, [
    approval.approvalRequired,
    approval.isLoading,
    approval.tokens,
    buy,
    bySourceQuery.isFetching,
    byTargetQuery.isFetching,
    errorBaseBalanceSufficient,
    getFiatValueSource,
    getFiatValueTarget,
    isLiquidityError,
    isTradeBySource,
    openModal,
    provider?.network.name,
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
    liquidityQuery.data,
    isLiquidityError,
    isTargetEmptyError,
    target.symbol,
  ]);

  const openTradeRouteModal = useCallback(() => {
    openModal('tradeRouting', {
      tradeActionsWei,
      tradeActionsRes,
      source,
      target,
      isTradeBySource,
      onSuccess: clearInputs,
      buy,
    });
  }, [
    clearInputs,
    isTradeBySource,
    openModal,
    source,
    target,
    tradeActionsRes,
    tradeActionsWei,
    buy,
  ]);

  const getTokenFiat = useCallback(
    (value: string, query: any) => {
      return new BigNumber(value || 0).times(
        query.data?.[selectedFiatCurrency] || 0
      );
    },
    [selectedFiatCurrency]
  );

  const calcSlippage = useCallback((): BigNumber | null => {
    const sourceFiat = getTokenFiat(sourceInput, sourceTokenPriceQuery);
    const targetFiat = getTokenFiat(targetInput, targetTokenPriceQuery);

    if (sourceFiat.isEqualTo(0) || targetFiat.isEqualTo(0)) {
      return new BigNumber(0);
    }
    const diff = targetFiat.div(sourceFiat);
    const slippage = diff.minus(new BigNumber(1)).times(100);

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
  };
};
