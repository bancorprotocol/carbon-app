import { useGetPairStrategies, useGetUserStrategies } from 'libs/queries';
import { useMemo } from 'react';
import { toPairSlug } from 'utils/pairSearch';
import { useExplorerParams } from './useExplorerParams';
import { usePairs } from './usePairSearch';

export const useExplorer = () => {
  const { slug, type } = useExplorerParams();
  const { pairMap, nameMap } = usePairs();

  // PAIR
  const exactMatch = useMemo(() => {
    if (!slug) return;
    return pairMap.has(slug)
      ? pairMap.get(slug)
      : pairMap.get(toPairSlug(slug));
  }, [pairMap, slug]);
  const pairQuery = useGetPairStrategies({
    token0: exactMatch?.baseToken.address,
    token1: exactMatch?.quoteToken.address,
  });

  // WALLET
  const walletQuery = useGetUserStrategies({
    user: type === 'wallet' ? slug : undefined,
  });

  const query = type === 'wallet' ? walletQuery : pairQuery;
  return {
    pairMap,
    nameMap,
    strategies: query.data ?? [],
    isLoading: query.isLoading,
  };
};
