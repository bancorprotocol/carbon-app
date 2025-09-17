import { isAddress } from 'ethers';
import { useGetAllPairs } from 'libs/queries';
import { useCallback, useMemo } from 'react';
import { createPairMaps } from 'utils/pairSearch';
import { useTokens } from './useTokens';
import { Token } from 'libs/tokens';

export type PairStore = ReturnType<typeof usePairs>;

export const usePairs = () => {
  const { getTokenById } = useTokens();
  const pairQuery = useGetAllPairs();

  const maps = useMemo(() => {
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
  }, [getTokenById, pairQuery.data]);

  const getType = useCallback(
    (slug: string = '') => {
      if (!slug) return 'full';
      if (maps.pairMap.has(slug)) return 'pair';
      if (slug.split('_').length === 2) return 'pair';
      if (getTokenById(slug)) return 'token';
      if (isAddress(slug)) return 'wallet';
      return 'full';
    },
    [maps.pairMap, getTokenById],
  );

  return {
    map: maps.pairMap,
    names: maps.nameMap,
    isPending: pairQuery.isPending,
    getType,
  };
};

export const defaultPairs: PairStore = {
  map: new Map(),
  names: new Map(),
  isPending: false,
  getType: () => 'pair',
};
