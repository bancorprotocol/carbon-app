import { useTradePairs } from 'components/trade/useTradePairs';
import { useModal } from 'hooks/useModal';
import { usePairSearch } from 'hooks/usePairSearch';
import {
  ModalTradeTokenListData,
  TradePair,
} from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';

type Props = {
  id: string;
  data: ModalTradeTokenListData;
};

export const useModalTradeTokenList = ({ id, data }: Props) => {
  const {
    tradePairs,
    isLoading,
    isError,
    tradePairsPopular,
    favoritePairs,
    addFavoritePair,
    removeFavoritePair,
  } = useTradePairs();
  const { closeModal } = useModal();
  const { search, setSearch, filteredPairs } = usePairSearch({
    pairs: tradePairs,
  });

  const handleSelect = (tradePair: TradePair) => {
    data.onClick(tradePair);
    closeModal(id);
  };

  return {
    tradePairs: filteredPairs,
    tradePairsPopular,
    isLoading,
    isError,
    handleSelect,
    search,
    setSearch,
    favoritePairs,
    addFavoritePair,
    removeFavoritePair,
  };
};
