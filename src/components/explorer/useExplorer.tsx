import {
  useGetPairStrategies,
  useGetUserStrategies,
  useTokenStrategies,
} from 'libs/queries';
import { extractExplorerPair, usePairs } from 'hooks/usePairs';
import { useMemo } from 'react';
import { useParams } from '@tanstack/react-router';

export const useExplorer = () => {
  const { slug } = useParams({ from: '/explore/$slug' });
  const pairs = usePairs();

  const type = pairs.getType(slug);

  // SINGLE TOKEN
  const singleToken = (() => {
    if (type !== 'token') return;
    if (slug?.length !== 48 * 2 + 1) return;
    return slug;
  })();
  const tokenQuery = useTokenStrategies(singleToken);

  // PAIR
  const exactMatch = useMemo(() => {
    if (type !== 'pair') return {};
    const [base, quote] = extractExplorerPair(slug);
    return { base, quote };
  }, [slug, type]);

  const pairQuery = useGetPairStrategies(exactMatch);

  // WALLET
  const walletQuery = useGetUserStrategies({
    user: type === 'wallet' ? slug : undefined,
  });

  if (type === 'wallet') return walletQuery;
  if (type === 'pair') return pairQuery;
  return tokenQuery;
};
