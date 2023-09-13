import { useTradePairs } from 'components/trade/useTradePairs';
import { useModal } from 'hooks/useModal';
import {
  ModalTradeTokenListData,
  TradePair,
} from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';
import { useMemo, useState } from 'react';
import { createPairMaps, searchPairTrade } from 'utils/pairSearch';

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

  const [search, setSearch] = useState('');

  const { pairMap, nameMap } = useMemo(() => {
    return createPairMaps(tradePairs ?? []);
  }, [tradePairs]);
  const filteredPairs = useMemo(() => {
    return searchPairTrade(pairMap, nameMap, search);
  }, [pairMap, nameMap, search]);

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
