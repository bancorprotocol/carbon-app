import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Token } from 'libs/tokens';
import { useMissingTokensQuery, useExistingTokensQuery } from 'libs/queries';
import { lsService } from 'services/localeStorage';

export interface TokensStore {
  tokens: Token[];
  importedTokens: Token[];
  setImportedTokens: Dispatch<SetStateAction<Token[]>>;
  tokensMap: Map<string, Token>;
  isPending: boolean;
  isError: boolean;
}

export const useTokensStore = (): TokensStore => {
  // Known token from static token list
  const existing = useExistingTokensQuery();
  // Tokens from pairs not in static token list
  const missing = useMissingTokensQuery(existing);
  // Tokens imported by the user
  const [importedTokens, setImportedTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (importedTokens.length) {
      const previous = lsService.getItem('importedTokens') ?? [];
      lsService.setItem('importedTokens', previous.concat(importedTokens));
    }
  }, [importedTokens]);

  // TODO add tokens imported by hand

  const tokensMap = useMemo(() => {
    const map = new Map<string, Token>();
    for (const token of existing.data || []) {
      map.set(token.address.toLowerCase(), token);
    }
    for (const token of missing.data || []) {
      map.set(token.address.toLowerCase(), token);
    }
    for (const token of importedTokens) {
      map.set(token.address.toLowerCase(), token);
    }
    return map;
  }, [existing.data, missing.data, importedTokens]);

  const tokens = useMemo(() => Array.from(tokensMap.values()), [tokensMap]);

  const isPending = useMemo(() => {
    return existing.isPending || missing.isPending;
  }, [existing.isPending, missing.isPending]);
  const isError = useMemo(() => {
    return existing.isError || missing.isError;
  }, [existing.isError, missing.isError]);

  return {
    tokens,
    importedTokens,
    tokensMap,
    isPending,
    isError,
    setImportedTokens,
  };
};

export const defaultTokensStore: TokensStore = {
  tokens: [],
  importedTokens: [],
  setImportedTokens: () => {},
  tokensMap: new Map(),
  isPending: false,
  isError: false,
};
