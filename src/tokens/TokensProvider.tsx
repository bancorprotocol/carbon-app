import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { Token } from 'services/tokens';
import { useTokensQuery } from 'queries/offChain/tokens';

interface TokensContext {
  tokens: Token[];
  getTokenById: (id: string) => Token | undefined;
}

const defaultValue: TokensContext = {
  tokens: [],
  getTokenById: (id) => {
    console.log(id);
    return undefined;
  },
};

const TokensCTX = createContext<TokensContext>(defaultValue);

export const TokensProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const tokensQuery = useTokensQuery();

  const tokens = useMemo(() => tokensQuery.data ?? [], [tokensQuery.data]);

  const tokensMap = useMemo(
    () => new Map(tokens.map((token) => [token.address, token])),
    [tokens]
  );

  const getTokenById = (id: string) => tokensMap.get(id);

  return (
    <TokensCTX.Provider value={{ tokens, getTokenById }}>
      {children}
    </TokensCTX.Provider>
  );
};

export const useTokens = () => {
  return useContext(TokensCTX);
};
