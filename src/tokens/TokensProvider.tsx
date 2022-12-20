import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Token, TokenList } from 'tokens';
import { useTokenLists, useTokensQuery } from 'queries';
import { lsService } from '../services/localeStorage';

interface TokensContext {
  tokenLists: TokenList[];
  tokens: Token[];
  getTokenById: (id: string) => Token | undefined;
  importToken: (token: Token) => void;
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
  importToken: (token) => {
    console.log(token);
  },
  isLoading: false,
  isError: false,
  error: undefined,
};

const TokensCTX = createContext<TokensContext>(defaultValue);

export const TokensProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const tokenListsQuery = useTokenLists();
  const tokensQuery = useTokensQuery();
  const [importedTokens, setImportedTokens] = useState<Token[]>([]);

  const tokenLists = useMemo(
    () => tokenListsQuery.data ?? [],
    [tokenListsQuery.data]
  );
  const tokens = useMemo(
    () => (tokensQuery.data ? [...tokensQuery.data, ...importedTokens] : []),
    [tokensQuery.data, importedTokens]
  );

  const _tokensMap = useMemo(
    () => new Map(tokens.map((token) => [token.address, token])),
    [tokens]
  );

  const getTokenById = useCallback(
    (id: string) => _tokensMap.get(id),
    [_tokensMap]
  );

  const importToken = useCallback(
    (token: Token) => {
      const exists =
        _tokensMap.has(token.address) ||
        !!importedTokens.find((tkn) => tkn.address === token.address);
      if (exists) return;

      const lsImportedTokens = lsService.getItem('importedTokens') ?? [];
      const existsInLs = !!lsImportedTokens.find(
        (tkn) => tkn.address === token.address
      );
      if (existsInLs) return;

      const newTokens = [...lsImportedTokens, token];
      setImportedTokens(newTokens);
      lsService.setItem('importedTokens', newTokens);
    },
    [_tokensMap, importedTokens]
  );

  const isLoading = tokenListsQuery.isLoading || tokensQuery.isLoading;
  const isError = tokenListsQuery.isError || tokensQuery.isError;
  const error = tokenListsQuery.error || tokensQuery.error;

  return (
    <TokensCTX.Provider
      value={{
        tokenLists,
        tokens,
        getTokenById,
        isLoading,
        isError,
        error,
        importToken,
      }}
    >
      {children}
    </TokensCTX.Provider>
  );
};

export const useTokens = () => {
  return useContext(TokensCTX);
};
