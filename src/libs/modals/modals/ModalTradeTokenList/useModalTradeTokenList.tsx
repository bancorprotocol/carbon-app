import { useTradePairs } from 'components/trade/useTradePairs';
import { useModal } from 'hooks/useModal';
import {
  ModalTradeTokenListData,
  TradePair,
} from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';
import { useMemo, useState } from 'react';
import { orderBy } from 'lodash';

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

  const filteredPairs = useMemo(() => {
    const splitDash = search.split('-');
    const splitSpace = search.split(' ');

    let value0 = search;
    let value1 = '';
    if (splitDash.length === 2) {
      value0 = splitDash[0].toLowerCase();
      value1 = splitDash[1].toLowerCase();
    }
    if (splitSpace.length === 2) {
      value0 = splitSpace[0].toLowerCase();
      value1 = splitSpace[1].toLowerCase();
    }
    const baseTokens = tradePairs.filter((pair) =>
      pair.baseToken.symbol.toLowerCase().includes(value0)
    );

    if (value1) {
      return orderBy(
        baseTokens.filter((pair) =>
          pair.quoteToken.symbol.toLowerCase().includes(value1)
        ),
        'baseToken.symbol',
        'asc'
      );
    }
    return orderBy(baseTokens, 'baseToken.symbol', 'asc');
  }, [tradePairs, search]);

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
