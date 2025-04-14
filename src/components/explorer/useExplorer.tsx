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
    if (type !== 'token') return;
    if (slug?.split('_').length !== 1) return;
    return slug;
  })();
  const tokenQuery = useTokenStrategies(singleToken);

  // PAIR
  const exactMatch = useMemo(() => {
    if (type !== 'pair') return;
    const [base, quote] = slug.split('_');
    if (!base || !quote) return;
    return pairs.map.get(`${base}_${quote}`);
  }, [pairs.map, slug, type]);
  const pairQuery = useGetPairStrategies({
    token0: exactMatch?.baseToken.address,
    token1: exactMatch?.quoteToken.address,
  });

  // WALLET
  const walletQuery = useGetUserStrategies({
    user: type === 'wallet' ? slug : undefined,
  });

  if (type === 'wallet') return walletQuery;
  if (type === 'pair') return pairQuery;
  return tokenQuery;
};
