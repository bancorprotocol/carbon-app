import { useGetPairStrategies, useGetUserStrategies } from 'libs/queries';
import { useExplorerParams } from './useExplorerParams';
import { usePairs } from 'hooks/usePairs';
import { useMemo } from 'react';

export const useExplorer = () => {
  const { slug, type } = useExplorerParams('/explore/$type');
  const pairs = usePairs();

  // PAIR
  const exactMatch = useMemo(() => pairs.map.get(slug!), [pairs.map, slug]);
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
