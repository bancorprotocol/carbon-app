import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { usePairSearch } from 'hooks/usePairSearch';
import { useGetPairStrategies, useGetTradePairsData } from 'libs/queries';
import { useMemo } from 'react';
import { pairSearchKey } from 'utils/pairSearch';

interface Props {
  search?: string;
  params: ExplorerRouteGenerics['Params'];
}

export const useExplorerPairs = ({ search = '', params: { slug } }: Props) => {
  const pairsQuery = useGetTradePairsData();

  const { filteredPairs, nameMap, pairMap } = usePairSearch({
    search,
    pairs: pairsQuery.data ?? [],
  });

  const exactMatch = useMemo(() => {
    if (!slug) return;
    return pairMap.has(slug)
      ? pairMap.get(slug)
      : pairMap.get(pairSearchKey(slug));
  }, [pairMap, slug]);

  const strategiesQuery = useGetPairStrategies({
    token0: exactMatch?.baseToken.address,
    token1: exactMatch?.quoteToken.address,
  });

  return {
    filteredPairs,
    nameMap,
    exactMatch,
    strategiesQuery,
  };
};
