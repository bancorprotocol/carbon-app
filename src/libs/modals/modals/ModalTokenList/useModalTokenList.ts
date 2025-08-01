import { useCallback, useEffect, useMemo, useState } from 'react';
import { Token } from 'libs/tokens';
import { useTokens } from 'hooks/useTokens';
import { useModal } from 'hooks/useModal';
import Fuse from 'fuse.js';
import { isAddress } from 'ethers';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList/ModalTokenList';
import config from 'config';
import {
  NATIVE_TOKEN_ADDRESS,
  isGasTokenToHide,
  nativeToken,
} from 'utils/tokens';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useContract } from 'hooks/useContract';

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

type Props = {
  id: string;
  data: ModalTokenListData;
};

export const useModalTokenList = ({ id, data }: Props) => {
  const {
    tokens,
    isPending,
    isError,
    error,
    addFavoriteToken,
    removeFavoriteToken,
    favoriteTokens,
    tokensMap,
    importTokens,
    getTokenById,
  } = useTokens();
  const {
    onClick,
    excludedTokens = [],
    includedTokens = [],
    isBaseToken = false,
  } = data;
  const { closeModal } = useModal();
  const [search, setSearch] = useState('');
  const { Token } = useContract();

  const basePopularTokens = config.popularTokens.base;
  const quotePopularTokens = config.popularTokens.quote;
  const defaultPopularTokens = isBaseToken
    ? basePopularTokens
    : quotePopularTokens;

  useEffect(() => {
    if (isPending) return;
    const getMissingToken: Promise<Token>[] = [];
    for (const token of defaultPopularTokens) {
      if (!getTokenById(token)) {
        getMissingToken.push(fetchTokenData(Token, token));
      }
    }
    Promise.allSettled(getMissingToken).then((res) => {
      const success = res
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);
      const errors = res
        .filter((r) => r.status === 'rejected')
        .map((r) => r.reason);
      importTokens(success);
      for (const error of errors) {
        console.error(error);
      }
    });
  }, [Token, defaultPopularTokens, getTokenById, importTokens, isPending]);

  const onSelect = useCallback(
    (token: Token) => {
      onClick(token);
      closeModal(id);
    },
    [onClick, closeModal, id],
  );

  const sanitizedTokens = useMemo(
    () =>
      tokens.filter(
        (token) =>
          (includedTokens.length === 0 ||
            includedTokens.includes(token.address)) &&
          !excludedTokens.includes(token.address) &&
          !isGasTokenToHide(token.address),
      ),
    [tokens, excludedTokens, includedTokens],
  );

  const duplicateSymbols = useMemo(() => {
    const seenSymbol: Record<string, boolean> = {};
    const duplicates = new Set<string>();
    for (const token of tokens) {
      if (seenSymbol[token.symbol]) duplicates.add(token.symbol);
      seenSymbol[token.symbol] = true;
    }
    return Array.from(duplicates);
  }, [tokens]);

  const _favoriteTokens = useMemo(
    () =>
      favoriteTokens.filter(
        (token) => !excludedTokens.includes(token?.address || ''),
      ),
    [excludedTokens, favoriteTokens],
  );

  const fuseIndex = useMemo(
    () => Fuse.createIndex(SEARCH_KEYS, sanitizedTokens),
    [sanitizedTokens],
  );

  const fuse = useMemo(
    () =>
      new Fuse(
        sanitizedTokens,
        {
          keys: SEARCH_KEYS,
          threshold: 0.3,
          distance: 50,
        },
        fuseIndex,
      ),
    [sanitizedTokens, fuseIndex],
  );

  const filteredTokens = useMemo(() => {
    if (search.length === 0) {
      return sanitizedTokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
    }

    const isValidAddress = isAddress(search.toLowerCase());
    if (isValidAddress) {
      if (
        isGasTokenToHide(search.toLowerCase()) &&
        !excludedTokens.includes(NATIVE_TOKEN_ADDRESS)
      )
        return [nativeToken];
      const found = sanitizedTokens.find(
        (token) => token.address.toLowerCase() === search.toLowerCase(),
      );
      if (found) {
        return [found];
      }
      return [];
    }

    const result = fuse.search(search);
    return result.map((result) => result.item);
  }, [search, fuse, sanitizedTokens, excludedTokens]);

  const showImportToken = useMemo(() => {
    const isValidAddress = isAddress(search.toLowerCase());
    if (isGasTokenToHide(search.toLowerCase())) return false;
    return (
      isValidAddress &&
      !filteredTokens.find(
        (token) => token.address.toLowerCase() === search.toLowerCase(),
      )
    );
  }, [search, filteredTokens]);

  const showNoResults = useMemo(
    () => !showImportToken && filteredTokens.length === 0,
    [showImportToken, filteredTokens],
  );

  const popularTokens = useMemo(() => {
    return defaultPopularTokens
      .map((tokenAddress) => tokensMap.get(tokenAddress.toLowerCase()))
      .filter((token) => {
        if (!token) return false;
        return !excludedTokens.includes(token?.address || '');
      }) as Token[];
  }, [defaultPopularTokens, excludedTokens, tokensMap]);

  return {
    search,
    setSearch,
    showImportToken,
    showNoResults,
    filteredTokens,
    duplicateSymbols,
    onSelect,
    isPending,
    isError,
    error,
    addFavoriteToken,
    removeFavoriteToken,
    favoriteTokens: _favoriteTokens,
    popularTokens,
  };
};
