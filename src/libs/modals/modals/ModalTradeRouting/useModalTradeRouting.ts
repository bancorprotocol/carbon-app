import { useCallback, useMemo, useState } from 'react';
import { Action } from '@bancor/carbon-sdk';
import { useWagmi } from 'libs/wagmi';
import { ModalTradeRoutingData } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRouting';
import { useGetTradeActionsQuery } from 'libs/queries/sdk/tradeActions';
import { useModal } from 'hooks/useModal';
import { useTradeAction } from 'components/trade/tradeWidget/useTradeAction';
import { SafeDecimal } from 'libs/safedecimal';
import { useGetTokenPrice } from 'libs/queries';

interface Props {
  id: string;
  data: ModalTradeRoutingData;
}

export const useModalTradeRouting = ({
  id,
  data: {
    source,
    target,
    isTradeBySource,
    tradeActionsWei,
    tradeActionsRes,
    onSuccess,
    isBuy = false,
    sourceBalance,
  },
}: Props) => {
  const { user } = useWagmi();
  const { openModal, closeModal } = useModal();
  const sourceFiatPrice = useGetTokenPrice(source.address);
  const targetFiatPrice = useGetTokenPrice(target.address);

  const [selected, setSelected] = useState<
    (Action & { isSelected: boolean })[]
  >(tradeActionsRes.map((data) => ({ ...data, isSelected: true })));

  const selectedIDs = useMemo(
    () =>
      selected.filter((action) => action.isSelected).map((action) => action.id),
    [selected],
  );

  const selectedActionsWei = useMemo(
    () => tradeActionsWei.filter((x) => selectedIDs.includes(x.id)),
    [selectedIDs, tradeActionsWei],
  );

  const { data, isPending, isError } = useGetTradeActionsQuery({
    sourceToken: source.address,
    isTradeBySource,
    targetToken: target.address,
    actionsWei: selectedActionsWei,
  });
  const sourceInput = data?.totalSourceAmount || '0';

  const { trade, calcMaxInput, isAwaiting } = useTradeAction({
    onSuccess: () => {
      onSuccess();
      closeModal(id);
    },
  });

  const handleCTAClick = useCallback(() => {
    if (!user) {
      return openModal('wallet');
    }

    if (isPending || isError) {
      return;
    }

    return trade({
      source,
      target,
      tradeActions: data.tradeActions,
      isTradeBySource,
      sourceInput,
      targetInput: data.totalTargetAmount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    isPending,
    isError,
    openModal,
    trade,
    source,
    target,
    data?.tradeActions,
    data?.totalSourceAmount,
    data?.totalTargetAmount,
    isTradeBySource,
    isBuy,
  ]);

  const onSelect = (id: string) => {
    setSelected((prev) =>
      prev.map((action) =>
        action.id === id
          ? { ...action, isSelected: !action.isSelected }
          : action,
      ),
    );
  };

  const totalSourceAmount = data?.totalSourceAmount || '0';
  const totalTargetAmount = data?.totalTargetAmount || '0';
  const insufficientBalance =
    !!user &&
    new SafeDecimal(sourceBalance).lt(
      isTradeBySource ? sourceInput : calcMaxInput(sourceInput),
    );
  const errorMsg = insufficientBalance ? 'Insufficient Balance' : '';
  const onCancel = useCallback(() => {
    closeModal(id);
  }, [closeModal, id]);

  const disabledCTA =
    !selectedIDs.length || isPending || isError || insufficientBalance;

  const buttonText = user ? 'Confirm' : 'Connect Wallet';

  return {
    selected,
    onSelect,
    handleCTAClick,
    sourceFiatPrice,
    targetFiatPrice,
    onCancel,
    totalSourceAmount,
    totalTargetAmount,
    disabledCTA,
    buttonText,
    errorMsg,
    isAwaiting,
  };
};
