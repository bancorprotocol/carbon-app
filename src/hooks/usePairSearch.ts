import { useMemo } from 'react';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { createPairMaps, searchPairTrade } from 'utils/pairSearch';

interface Props {
  search: string;
  pairs: TradePair[];
}

export const usePairSearch = ({ pairs, search }: Props) => {
  const pairMaps = useMemo(() => createPairMaps(pairs), [pairs]);
  const filteredPairs = useMemo(() => {
    return searchPairTrade(pairMaps, search);
  }, [pairMaps, search]);

  return {
    filteredPairs,
    pairMap: pairMaps.pairMap,
    nameMap: pairMaps.nameMap,
  };
};
