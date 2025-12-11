import { useMemo, useState } from 'react';
import { Token } from 'libs/tokens';
import { useTokens } from 'hooks/useTokens';
import Fuse from 'fuse.js';
import { getAddress, isAddress } from 'ethers';
import {
  NATIVE_TOKEN_ADDRESS,
  isGasTokenToHide,
  nativeToken,
} from 'utils/tokens';
import { TonToken } from 'libs/ton/tokenMap';
import { isTonAddress } from 'libs/ton/is-address';

const SEARCH_KEYS = [
  {
    name: 'symbol',
    weight: 0.6,
  },
  {
    name: 'name',
    weight: 0.4,
  },
];
const fuseConfig = {
  keys: SEARCH_KEYS,
  threshold: 0.3,
  distance: 50,
};

export const useModalTokenList = (excludedTokens: string[] = []) => {
  const { tokens } = useTokens();
  const [search, setSearch] = useState('');

  const sanitizedTokens = useMemo(() => {
    return tokens
      .filter((token) => {
        if (excludedTokens.includes(token.address)) return false;
        if (isGasTokenToHide(token.address)) return false;
        return true;
      })
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [tokens, excludedTokens]);

  const duplicateSymbols = useMemo(() => {
    const seenSymbol: Record<string, boolean> = {};
    const duplicates = new Set<string>();
    for (const token of tokens) {
      if (seenSymbol[token.symbol]) duplicates.add(token.symbol);
      seenSymbol[token.symbol] = true;
    }
    return Array.from(duplicates);
  }, [tokens]);

  const fuse = useMemo(() => {
    const index = Fuse.createIndex(SEARCH_KEYS, sanitizedTokens);
    return new Fuse(sanitizedTokens, fuseConfig, index);
  }, [sanitizedTokens]);

  const filtered = useMemo(() => {
    if (!search) return sanitizedTokens;
    const lowercase = search.toLowerCase();
    const isEthAdress = isAddress(lowercase);

    if (import.meta.env.VITE_NETWORK === 'ton' && isTonAddress(search)) {
      const found = (sanitizedTokens as TonToken[]).find((token) =>
        token.tonAddress.includes(search),
      );
      if (found) return [found];
      return [];
    } else {
      if (isEthAdress) {
        if (
          isGasTokenToHide(lowercase) &&
          !excludedTokens.includes(NATIVE_TOKEN_ADDRESS)
        ) {
          return [nativeToken];
        }
        const found = sanitizedTokens.find(
          (token) => token.address.toLowerCase() === lowercase,
        );
        if (found) return [found];
        return [];
      }
      const result = fuse.search(search);
      return result.map((result) => result.item);
    }
  }, [search, fuse, sanitizedTokens, excludedTokens]);

  const map = useMemo(() => {
    const map = new Map<string, Token>();
    for (const token of filtered) {
      map.set(getAddress(token.address), token);
    }
    return map;
  }, [filtered]);

  const showImportToken = useMemo(() => {
    const lowercase = search.toLowerCase();
    const isEthAdress = isAddress(lowercase);
    if (isGasTokenToHide(lowercase)) return false;
    if (import.meta.env.VITE_NETWORK === 'ton' && isTonAddress(search)) {
      const existing = (filtered as TonToken[]).some(
        (token) => token.tonAddress === search,
      );
      return !existing;
    } else {
      const existing = filtered.some(
        (token) => token.address.toLowerCase() === search.toLowerCase(),
      );
      if (existing) return false;
      if (isEthAdress) return true;
    }
    return false;
  }, [search, filtered]);

  const showNoResults = useMemo(
    () => !showImportToken && filtered.length === 0,
    [showImportToken, filtered],
  );

  return {
    search,
    setSearch,
    showImportToken,
    showNoResults,
    filteredTokens: filtered,
    duplicateSymbols,
    all: map,
  };
};
