import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Action } from '@bancor/carbon-sdk';
import { useWeb3 } from 'libs/web3';
import { ModalTradeRoutingData } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRouting';
import { useGetTradeActionsQuery } from 'libs/queries/sdk/tradeActions';
import { useModal } from 'hooks/useModal';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useTradeAction } from 'components/trade/tradeWidget/useTradeAction';
import { SafeDecimal } from 'libs/safedecimal';

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
    sourceBalance,
    setIsAwaiting,
  },
}: Props) => {
  const { user, provider } = useWeb3();
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
  const sourceInput = data?.totalSourceAmount || '0';

  const { trade, calcMaxInput, approval } = useTradeAction({
    source,
    isTradeBySource,
    sourceInput,
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
        sourceInput,
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
          blockchainNetwork: provider?.network?.name || '',
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
    provider?.network?.name,
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

  const totalSourceAmount = data?.totalSourceAmount || '0';
  const totalTargetAmount = data?.totalTargetAmount || '0';
  const insufficientBalance = new SafeDecimal(sourceBalance).lt(
    isTradeBySource ? sourceInput : calcMaxInput(sourceInput)
  );
  const errorMsg = insufficientBalance ? 'Insufficient Balance' : '';
  const onCancel = useCallback(() => {
    closeModal(id);
  }, [closeModal, id]);

  const disabledCTA =
    !selectedIDs.length || isLoading || isError || insufficientBalance;

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
    errorMsg,
  };
};
