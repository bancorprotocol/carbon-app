import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Token } from 'libs/tokens';
import { Strategy, useTokensQuery } from 'libs/queries';
import { decimalFetcherSDKMap } from 'libs/sdk/carbonSdk';

export interface TokensStore {
  tokens: Token[];
  importedTokens: Token[];
  setImportedTokens: Dispatch<SetStateAction<Token[]>>;
  tokensMap: Map<string, Token>;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  strategy: Strategy | undefined;
  setStrategy: Dispatch<SetStateAction<Strategy | undefined>>;
}

export const useTokensStore = (): TokensStore => {
  const tokensQuery = useTokensQuery();
  const [importedTokens, setImportedTokens] = useState<Token[]>([]);
  const [strategy, setStrategy] = useState<Strategy | undefined>(undefined);

  const tokens = useMemo(
    () => (tokensQuery.data ? [...tokensQuery.data, ...importedTokens] : []),
    [tokensQuery.data, importedTokens]
  );

  const tokensMap = useMemo(
    () => new Map(tokens.map((token) => [token.address.toLowerCase(), token])),
    [tokens]
  );

  const isLoading = tokensQuery.isLoading;
  const isError = tokensQuery.isError;
  const error = tokensQuery.error;

  useEffect(() => {
    if (tokens.length) {
      decimalFetcherSDKMap.map = new Map(
        tokens.map((t) => [t.address.toLowerCase(), t.decimals])
      );
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
    strategy,
    setStrategy,
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
  strategy: undefined,
  setStrategy: () => {},
};
