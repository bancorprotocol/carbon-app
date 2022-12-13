import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { Token, TokenList } from 'tokens';
import { useTokenLists, useTokensQuery } from 'queries';

interface TokensContext {
  tokenLists: TokenList[];
  tokens: Token[];
  getTokenById: (id: string) => Token | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

const defaultValue: TokensContext = {
  tokenLists: [],
  tokens: [],
  getTokenById: (id) => {
    console.log(id);
    return undefined;
  },
  isLoading: false,
  isError: false,
  error: undefined,
};

const TokensCTX = createContext<TokensContext>(defaultValue);

export const TokensProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const tokenListsQuery = useTokenLists();
  const tokensQuery = useTokensQuery();

  const tokenLists = useMemo(
    () => tokenListsQuery.data ?? [],
    [tokenListsQuery.data]
  );

  const tokens = useMemo(() => tokensQuery.data ?? [], [tokensQuery.data]);

  const _tokensMap = useMemo(
    () => new Map(tokens.map((token) => [token.address, token])),
    [tokens]
  );

  const getTokenById = (id: string) => _tokensMap.get(id);

  const isLoading = useMemo(
    () => tokenListsQuery.isLoading || tokensQuery.isLoading,
    [tokenListsQuery.isLoading, tokensQuery.isLoading]
  );

  const isError = useMemo(
    () => tokenListsQuery.isError || tokensQuery.isError,
    [tokenListsQuery.isError, tokensQuery.isError]
  );

  const error = useMemo(
    () => tokenListsQuery.error || tokensQuery.error,
    [tokenListsQuery.error, tokensQuery.error]
  );

  return (
    <TokensCTX.Provider
      value={{ tokenLists, tokens, getTokenById, isLoading, isError, error }}
    >
      {children}
    </TokensCTX.Provider>
  );
};

export const useTokens = () => {
  return useContext(TokensCTX);
};
