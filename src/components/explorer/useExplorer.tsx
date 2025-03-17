import {
  useGetPairStrategies,
  useGetUserStrategies,
  useTokenStrategies,
} from 'libs/queries';
import { usePairs } from 'hooks/usePairs';
import { useMemo } from 'react';
import { useParams } from '@tanstack/react-router';

export const useExplorer = () => {
  const { slug } = useParams({ from: '/explore/$slug' });
  const pairs = usePairs();

  const type = pairs.getType(slug);

  // SINGLE TOKEN
  const singleToken = (() => {
    if (type === 'wallet') return;
    if (slug?.split('_').length !== 1) return;
    return slug;
  })();
  const tokenQuery = useTokenStrategies(singleToken);

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

  if (type === 'wallet') return walletQuery;
  return singleToken ? tokenQuery : pairQuery;
};
