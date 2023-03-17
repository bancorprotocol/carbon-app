import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Token } from 'libs/tokens';
import { useTokensQuery } from 'libs/queries';

export interface TokensStore {
  tokens: Token[];
  importedTokens: Token[];
  setImportedTokens: Dispatch<SetStateAction<Token[]>>;
  tokensMap: Map<string, Token>;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export const useTokensStore = (): TokensStore => {
  const tokensQuery = useTokensQuery();
  const [importedTokens, setImportedTokens] = useState<Token[]>([]);

  const tokens = useMemo(() => {
    if (tokensQuery.data && tokensQuery.data.length) {
      // TODO check for duplicates
      return [...tokensQuery.data, ...importedTokens];
    }
    return [];
  }, [tokensQuery.data, importedTokens]);

  const tokensMap = useMemo(
    () => new Map(tokens.map((token) => [token.address.toLowerCase(), token])),
    [tokens]
  );

  const isLoading = tokensQuery.isLoading;
  const isError = tokensQuery.isError;
  const error = tokensQuery.error;

  useEffect(() => {
    if (tokens.length) {
      // TODO fix decimal fetcher for web worker
      // decimalFetcherSDKMap.map = new Map(
      //   tokens.map((t) => [t.address.toLowerCase(), t.decimals])
      // );
    }
  }, [tokens]);

  return {
    tokens,
    importedTokens,
    tokensMap,
    isLoading,
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
  isLoading: false,
  isError: false,
  error: undefined,
};
