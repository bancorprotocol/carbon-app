import { useGetPairStrategies, useGetUserStrategies } from 'libs/queries';
import { useMemo } from 'react';
import { fromPairSlug } from 'utils/pairSearch';
import { useExplorerParams } from './useExplorerParams';
import { usePairs } from 'hooks/usePairs';

export const useExplorer = () => {
  const { slug, type } = useExplorerParams();
  const pairs = usePairs();

  // PAIR
  const exactMatch = useMemo(() => {
    if (!slug) return;
    return pairs.map.has(slug)
      ? pairs.map.get(slug)
      : pairs.map.get(fromPairSlug(slug));
  }, [pairs.map, slug]);
  const pairQuery = useGetPairStrategies({
    token0: exactMatch?.baseToken.address,
    token1: exactMatch?.quoteToken.address,
  });

  // WALLET
  const walletQuery = useGetUserStrategies({
    user: type === 'wallet' ? slug : undefined,
  });

  return type === 'wallet' ? walletQuery : pairQuery;
};
