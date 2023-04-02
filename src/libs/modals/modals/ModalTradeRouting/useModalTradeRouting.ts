import { useWeb3 } from 'libs/web3';
import { useModal } from 'hooks/useModal';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useCallback, useMemo, useState } from 'react';
import { useTradeAction } from 'components/trade/tradeWidget/useTradeAction';
import { ModalTradeRoutingData } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRouting';
import { Action } from '@bancor/carbon-sdk';
import { useGetTradeActionsQuery } from 'libs/queries/sdk/tradeActions';

type Props = {
  id: string;
  data: ModalTradeRoutingData;
};

export const useModalTradeRouting = ({
  id,
  data: {
    source,
    target,
    isTradeBySource,
    tradeActionsWei,
    tradeActionsRes,
    onSuccess,
    buy,
  },
}: Props) => {
  const { user } = useWeb3();
  const { openModal, closeModal } = useModal();
  const { useGetTokenPrice } = useFiatCurrency();
  const sourceFiatPrice = useGetTokenPrice(source.symbol);
  const targetFiatPrice = useGetTokenPrice(target.symbol);
  const { getFiatValue: getFiatValueSource } = useFiatCurrency(source);
  const { getFiatValue: getFiatValueTarget } = useFiatCurrency(target);
  const [selected, setSelected] = useState<
    (Action & { isSelected: boolean })[]
  >(tradeActionsRes.map((data) => ({ ...data, isSelected: true })));

  const selectedIDs = useMemo(
    () =>
      selected.filter((action) => action.isSelected).map((action) => action.id),
    [selected]
  );

  const selectedActionsWei = useMemo(
    () => tradeActionsWei.filter((x) => selectedIDs.includes(x.id)),
    [selectedIDs, tradeActionsWei]
  );

  const { data, isLoading, isError } = useGetTradeActionsQuery({
    sourceToken: source.address,
    isTradeBySource,
    targetToken: target.address,
    actionsWei: selectedActionsWei,
  });

  const { trade, approval } = useTradeAction({
    source,
    isTradeBySource,
    sourceInput: data?.totalSourceAmount || '0',
    onSuccess: () => {
      onSuccess();
      closeModal(id);
    },
  });

  const handleCTAClick = useCallback(() => {
    if (!user) {
      return openModal('wallet', undefined);
    }

    if (approval.isLoading || isLoading || isError) {
      return;
    }

    const tradeFn = async () =>
      await trade({
        source,
        target,
        tradeActions: data.tradeActions,
        isTradeBySource,
        sourceInput: data.totalSourceAmount,
        targetInput: data.totalTargetAmount,
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
          value_usd: isTradeBySource
            ? getFiatValueSource(data?.totalSourceAmount, true).toString()
            : getFiatValueTarget(data?.totalTargetAmount, true).toString(),
        },
      });
    } else {
      void tradeFn();
    }
  }, [
    user,
    approval.isLoading,
    approval.approvalRequired,
    approval.tokens,
    isLoading,
    isError,
    openModal,
    trade,
    source,
    target,
    data?.tradeActions,
    data?.totalSourceAmount,
    data?.totalTargetAmount,
    isTradeBySource,
    buy,
    getFiatValueSource,
    getFiatValueTarget,
  ]);

  const onSelect = (id: string) => {
    setSelected((prev) =>
      prev.map((action) =>
        action.id === id
          ? { ...action, isSelected: !action.isSelected }
          : action
      )
    );
  };

  const onCancel = useCallback(() => {
    closeModal(id);
  }, [closeModal, id]);

  const disabledCTA = useMemo(
    () => !selectedIDs.length || isLoading || isError,
    [isError, isLoading, selectedIDs.length]
  );

  return {
    selected,
    onSelect,
    handleCTAClick,
    sourceFiatPrice,
    targetFiatPrice,
    onCancel,
    totalSourceAmount: data?.totalSourceAmount || '0',
    totalTargetAmount: data?.totalTargetAmount || '0',
    disabledCTA,
  };
};
