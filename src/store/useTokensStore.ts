import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Token } from 'libs/tokens';
import { useTokensQuery } from 'libs/queries';
import { lsService } from 'services/localeStorage';

export interface TokensStore {
  tokens: Token[];
  importedTokens: Token[];
  setImportedTokens: Dispatch<SetStateAction<Token[]>>;
  tokensMap: Map<string, Token>;
  isPending: boolean;
  isError: boolean;
  error: unknown;
}

export const useTokensStore = (): TokensStore => {
  const tokensQuery = useTokensQuery();
  const [importedTokens, setImportedTokens] = useState<Token[]>(
    lsService.getItem('importedTokens') ?? [],
  );

  useEffect(() => {
    lsService.setItem('importedTokens', importedTokens);
  }, [importedTokens]);

  const tokens = useMemo(() => {
    if (!tokensQuery.data?.length) return [];
    const result = new Map<string, Token>();
    for (const token of importedTokens) result.set(token.address, token);
    for (const token of tokensQuery.data) result.set(token.address, token);
    return Array.from(result.values());
  }, [tokensQuery.data, importedTokens]);

  const tokensMap = useMemo(
    () => new Map(tokens.map((token) => [token.address.toLowerCase(), token])),
    [tokens],
  );

  const isPending = tokensQuery.isPending;
  const isError = tokensQuery.isError;
  const error = tokensQuery.error;

  return {
    tokens,
    importedTokens,
    tokensMap,
    isPending,
    isError,
    error,
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
  error: undefined,
};
