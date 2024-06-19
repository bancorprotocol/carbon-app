import { useTradePairs } from 'components/trade/useTradePairs';
import { useModal } from 'hooks/useModal';
import {
  ModalTradeTokenListData,
  TradePair,
} from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';
import { useMemo, useState } from 'react';
import { usePairs } from 'hooks/usePairs';
import { searchPairTrade } from 'utils/pairSearch';

type Props = {
  id: string;
  data: ModalTradeTokenListData;
};

export const useModalTradeTokenList = ({ id, data }: Props) => {
  const {
    tradePairsPopular,
    favoritePairs,
    addFavoritePair,
    removeFavoritePair,
  } = useTradePairs();
  const pairs = usePairs();
  const { closeModal } = useModal();

  const [search, setSearch] = useState('');

  const filteredPairs = useMemo(() => {
    return searchPairTrade(pairs.map, pairs.names, search);
  }, [pairs.map, pairs.names, search]);

  const handleSelect = (tradePair: TradePair) => {
    data.onClick(tradePair);
    closeModal(id);
  };

  return {
    tradePairs: filteredPairs,
    tradePairsPopular,
    isPending: pairs.isPending,
    isError: pairs.isError,
    handleSelect,
    search,
    setSearch,
    favoritePairs,
    addFavoritePair,
    removeFavoritePair,
  };
};
