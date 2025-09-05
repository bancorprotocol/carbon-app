import {
  useGetPairStrategies,
  useGetUserStrategies,
  useTokenStrategies,
} from 'libs/queries';
import { usePairs } from 'hooks/usePairs';
import { useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';

export const useExplorer = () => {
  const { search = '' } = useSearch({ from: '/explore' });
  const pairs = usePairs();

  const type = pairs.getType(search);

  // SINGLE TOKEN
  const singleToken = (() => {
    if (type !== 'token') return;
    if (search?.split('_').length !== 1) return;
    return search;
  })();
  const tokenQuery = useTokenStrategies(singleToken);

  // PAIR
  const exactMatch = useMemo(() => {
    if (type !== 'pair') return;
    const [base, quote] = search.split('_');
    if (!base || !quote) return;
    return pairs.map.get(`${base}_${quote}`);
  }, [pairs.map, search, type]);
  const pairQuery = useGetPairStrategies({
    base: exactMatch?.baseToken.address,
    quote: exactMatch?.quoteToken.address,
  });

  // WALLET
  const walletQuery = useGetUserStrategies({
    user: type === 'wallet' ? search : undefined,
  });

  if (type === 'wallet') return walletQuery;
  if (type === 'pair') return pairQuery;
  return tokenQuery;
};
