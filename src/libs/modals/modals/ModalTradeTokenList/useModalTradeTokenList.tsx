import { useTrade } from 'components/trade/useTrade';
import { useModal } from 'libs/modals/ModalProvider';
import {
  ModalTradeTokenListData,
  TradePair,
} from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';

type Props = {
  id: string;
  data: ModalTradeTokenListData;
};

export const useModalTradeTokenList = ({ id, data }: Props) => {
  const { tradePairs, isLoading, isError } = useTrade();
  const { closeModal } = useModal();
  const handleSelect = (tradePair: TradePair) => {
    data.onClick(tradePair);
    closeModal(id);
  };

  return { tradePairs, isLoading, isError, handleSelect };
};
