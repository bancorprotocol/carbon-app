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
    const searchLowerCase = search.toLowerCase();
    const splitDash = searchLowerCase.split('-');
    const splitSpace = searchLowerCase.split(' ');

    let value0 = searchLowerCase;
    let value1 = '';

    if (splitDash.length === 2) {
      value0 = splitDash[0];
      value1 = splitDash[1];
    }
    if (splitSpace.length === 2) {
      value0 = splitSpace[0];
      value1 = splitSpace[1];
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
