import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Action } from '@bancor/carbon-sdk';
import { ModalTradeRoutingData } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRouting';
import { useGetTradeActionsQuery } from 'libs/queries/sdk/tradeActions';
import { useModal } from 'hooks/useModal';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useTradeAction } from 'components/trade/tradeWidget/useTradeAction';
import { useAccount, useNetwork } from 'wagmi';

type Props = {
  id: string;
  data: ModalTradeRoutingData & {
    setIsAwaiting: Dispatch<SetStateAction<boolean>>;
  };
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
    buy = false,
    setIsAwaiting,
  },
}: Props) => {
  const { address: user } = useAccount();
  const { chain } = useNetwork();
  const { openModal, closeModal } = useModal();
  const { useGetTokenPrice } = useFiatCurrency();
  const sourceFiatPrice = useGetTokenPrice(source.address);
  const targetFiatPrice = useGetTokenPrice(target.address);
  const { getFiatValue: getFiatValueSource } = useFiatCurrency(source);

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
      setIsAwaiting(false);
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
          productType: 'trade',
          buy,
          buyToken: target,
          sellToken: source,
          valueUsd: getFiatValueSource(
            data?.totalSourceAmount,
            true
          ).toString(),
          approvalTokens: approval.tokens,
          blockchainNetwork: chain?.name || '',
        },
      });
    } else {
      setIsAwaiting(true);
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
    setIsAwaiting,
    buy,
    getFiatValueSource,
    chain?.name,
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
