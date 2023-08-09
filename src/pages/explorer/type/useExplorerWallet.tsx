import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { usePairSearch } from 'hooks/usePairSearch';
import { useGetTradePairsData } from 'libs/queries';
import { useMatch } from 'libs/routing';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  slug?: string;
}

export const useExplorer = (props: Props = {}) => {
  const { params } = useMatch<ExplorerRouteGenerics>();

  const pairsQuery = useGetTradePairsData();

  const [search, setSearch] = useState('');

  const { filteredPairs } = usePairSearch({
    search,
    pairs: pairsQuery.data ?? [],
  });

  useEffect(() => {
    if (params.slug) {
      setSearch(params.slug.toUpperCase());
    }
  }, [params.slug, setSearch]);

  const exactMatch = useMemo(() => {
    const [symbol0, symbol1] = props.slug?.toLowerCase().split('-') ?? [];
    return (pairsQuery.data ?? []).find(
      (pair) =>
        pair.baseToken.symbol.toLowerCase() === symbol0 &&
        pair.quoteToken.symbol.toLowerCase() === symbol1
    );
  }, [pairsQuery.data, props.slug]);

  return { search, setSearch, filteredPairs, exactMatch, routeParams: params };
};
