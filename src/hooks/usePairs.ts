import { useGetTradePairsData } from 'libs/queries';
import { useMemo } from 'react';
import { createPairMaps } from 'utils/pairSearch';

export type PairStore = ReturnType<typeof usePairs>;

export const usePairs = () => {
  const { data, isError, isLoading } = useGetTradePairsData();
  const { pairMap, nameMap } = useMemo(() => createPairMaps(data), [data]);

  return {
    map: pairMap,
    names: nameMap,
    isError,
    isLoading,
  };
};

export const defaultPairs: PairStore = {
  map: new Map(),
  names: new Map(),
  isError: false,
  isLoading: false,
};
