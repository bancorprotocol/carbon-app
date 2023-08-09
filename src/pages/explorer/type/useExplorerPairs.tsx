import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { usePairSearch } from 'hooks/usePairSearch';
import { useGetPairStrategies, useGetTradePairsData } from 'libs/queries';
import { useMemo } from 'react';

interface Props {
  search?: string;
  params: ExplorerRouteGenerics['Params'];
}

export const useExplorerPairs = ({ search = '', params: { slug } }: Props) => {
  const pairsQuery = useGetTradePairsData();

  const { filteredPairs } = usePairSearch({
    search,
    pairs: pairsQuery.data ?? [],
  });

  const exactMatch = useMemo(() => {
    const [symbol0, symbol1] = slug?.toLowerCase().split('-') ?? [];
    return (pairsQuery.data ?? []).find(
      (pair) =>
        pair.baseToken.symbol.toLowerCase() === symbol0 &&
        pair.quoteToken.symbol.toLowerCase() === symbol1
    );
  }, [pairsQuery.data, slug]);

  const strategiesQuery = useGetPairStrategies({
    token0: exactMatch?.baseToken.address,
    token1: exactMatch?.quoteToken.address,
  });

  return { filteredPairs, exactMatch, strategiesQuery };
};
