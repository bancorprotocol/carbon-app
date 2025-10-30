import { isAddress } from 'ethers';
import { useGetAllPairs } from 'libs/queries/sdk/pairs';
import { useCallback, useMemo } from 'react';
import { createPairMaps } from 'utils/pairSearch';
import { useTokens } from './useTokens';
import { Token } from 'libs/tokens';

export type PairStore = ReturnType<typeof usePairs>;

// Change length if different address format that evm
const addressLength = 42;

export const isPairSlug = (slug: string) => {
  // ${address}_${address}
  return slug.length === addressLength * 2 + 1;
};

export const isTokenSlug = (slug?: string) => {
  return slug?.length === addressLength;
};

export const extractExplorerPair = (slug: string) => {
  const base = slug.slice(0, addressLength);
  const quote = slug.slice(addressLength * -1);
  return [base, quote];
};

export const usePairs = () => {
  const { getTokenById, isPending } = useTokens();
  const pairQuery = useGetAllPairs();

  const maps = useMemo(() => {
    if (isPending) return createPairMaps([]);

    const pairs = pairQuery.data || [];
    const result: { baseToken: Token; quoteToken: Token }[] = [];
    for (const pair of pairs) {
      const baseToken = getTokenById(pair[0]);
      const quoteToken = getTokenById(pair[1]);
      if (baseToken && quoteToken) result.push({ baseToken, quoteToken });
    }

    const pairsWithInverse = [
      ...result,
      ...result.map((p) => ({
        baseToken: p.quoteToken,
        quoteToken: p.baseToken,
      })),
    ];

    return createPairMaps(pairsWithInverse);
  }, [getTokenById, pairQuery.data, isPending]);

  const getType = useCallback(
    (slug: string = '') => {
      if (!slug) return 'full';
      if (maps.pairMap.has(slug)) return 'pair';
      if (isPairSlug(slug)) return 'pair';
      if (getTokenById(slug)) return 'token';
      if (isAddress(slug)) return 'wallet';
      return 'error';
    },
    [maps.pairMap, getTokenById],
  );

  return {
    map: maps.pairMap,
    names: maps.nameMap,
    isPending: isPending || pairQuery.isPending,
    isError: pairQuery.isError,
    getType,
  };
};

export const defaultPairs: PairStore = {
  map: new Map(),
  names: new Map(),
  isPending: false,
  isError: false,
  getType: () => 'pair',
};
