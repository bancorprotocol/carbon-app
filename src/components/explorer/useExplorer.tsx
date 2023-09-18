import { useGetPairStrategies, useGetUserStrategies } from 'libs/queries';
import { useMemo } from 'react';
import { toPairSlug } from 'utils/pairSearch';
import { useExplorerParams } from './useExplorerParams';
import { usePairs } from 'store/usePairStore';

export const useExplorer = () => {
  const { slug, type } = useExplorerParams();
  const pairs = usePairs();

  // PAIR
  const exactMatch = useMemo(() => {
    if (!slug) return;
    return pairs.map.has(slug)
      ? pairs.map.get(slug)
      : pairs.map.get(toPairSlug(slug));
  }, [pairs.map, slug]);
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
    strategies: query.data ?? [],
    isLoading: query.isLoading,
  };
};
