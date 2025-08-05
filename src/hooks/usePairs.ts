import { useGetTradePairsData } from 'libs/queries';
import { useCallback, useMemo } from 'react';
import { createPairMaps } from 'utils/pairSearch';
import config from 'config';

export type PairStore = ReturnType<typeof usePairs>;

export const isPairSlug = (slug: string) => {
  const addressLength = config.network.name === 'TON' ? 48 : 42;
  // ${address}_${address}
  return slug.length === addressLength * 2 + 1;
};

export const extractExplorerPair = (slug: string) => {
  const addressLength = config.network.name === 'TON' ? 48 : 42;
  const base = slug.slice(0, addressLength);
  const quote = slug.slice(addressLength * -1);
  return [base, quote];
};

export const usePairs = () => {
  const { data, isError, isPending } = useGetTradePairsData();
  const tokens = useMemo(() => {
    const set = new Set<string>();
    if (!data) return set;
    for (const { baseToken, quoteToken } of data) {
      set.add(baseToken.address.toLowerCase());
      set.add(quoteToken.address.toLowerCase());
    }
    return set;
  }, [data]);

  const maps = useMemo(() => createPairMaps(data), [data]);

  const getType = useCallback(
    (slug: string) => {
      if (maps.pairMap.has(slug)) return 'pair';
      if (slug.length === 2 * 48 + 1) return 'pair';
      if (tokens.has(slug)) return 'token';
      return 'wallet';
    },
    [maps.pairMap, tokens],
  );

  return {
    map: maps.pairMap,
    names: maps.nameMap,
    isError,
    isPending,
    getType,
  };
};

export const defaultPairs: PairStore = {
  map: new Map(),
  names: new Map(),
  isError: false,
  isPending: false,
  getType: () => 'pair',
};
