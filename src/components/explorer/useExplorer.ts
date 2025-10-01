import {
  useGetPairStrategies,
  useGetUserStrategies,
  useTokenStrategies,
  useGetAllStrategies,
} from 'libs/queries';
import { usePairs } from 'hooks/usePairs';
import { useEffect, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { getAddress, isAddress } from 'ethers';
import { lsService } from 'services/localeStorage';

export const useExplorer = () => {
  const { search = '' } = useSearch({ from: '/explore' });
  const { getType } = usePairs();

  const type = useMemo(() => getType(search), [getType, search]);

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
    if (!isAddress(base) || !isAddress(quote)) return;
    return { base, quote };
  }, [search, type]);
  const pairQuery = useGetPairStrategies(exactMatch);

  useEffect(() => {
    if (exactMatch) {
      const { base, quote } = exactMatch;
      lsService.setItem('tradePair', [getAddress(base), getAddress(quote)]);
    }
  }, [exactMatch]);

  // WALLET
  const walletQuery = useGetUserStrategies({
    user: type === 'wallet' ? search : undefined,
  });

  // ALL
  const allQuery = useGetAllStrategies({ enabled: type === 'full' });

  if (type === 'token') return tokenQuery;
  if (type === 'pair') return pairQuery;
  if (type === 'wallet') return walletQuery;
  return allQuery;
};
