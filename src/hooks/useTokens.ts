import { useCallback, useEffect, useState } from 'react';
import { Token } from 'libs/tokens';
import { useStore } from 'store';
import { useContract } from './useContract';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { getAddress } from 'ethers';

export const useTokens = () => {
  const {
    tokens: { tokensMap, setImportedTokens, ...props },
  } = useStore();
  const { Token } = useContract();

  // TODO: remove this in favor or useMemo with tokenMap
  const getTokenById = useCallback(
    (id?: string) => (id ? tokensMap.get(id.toLowerCase()) : undefined),
    [tokensMap],
  );

  const importTokens = useCallback(
    (tokens: Token[]) => {
      setImportedTokens((existing) => {
        const map = new Map();
        for (const item of existing) map.set(item.address, item);
        const missing: Token[] = [];
        for (const token of tokens) {
          const normalizedAddress = getAddress(token.address);
          if (map.has(normalizedAddress)) continue;
          missing.push({ ...token, address: normalizedAddress });
        }
        if (!missing.length) return existing;
        return [...existing, ...missing];
      });
    },
    [setImportedTokens],
  );

  const importTokenAddresses = useCallback(
    async (addresses: string[]) => {
      const missing = new Set<string>();
      for (const address of addresses) {
        if (!getTokenById(address)) missing.add(address);
      }
      if (!missing.size) return;
      const fetchAll = [];
      for (const address of missing) {
        fetchAll.push(fetchTokenData(Token, address));
      }
      return Promise.allSettled(fetchAll)
        .then((res) => {
          const tokens = res
            .filter((r) => r.status === 'fulfilled')
            .map((r) => r.value);
          importTokens(tokens);
        })
        .catch((err) => console.error(err));
    },
    [Token, getTokenById, importTokens],
  );

  return {
    ...props,
    getTokenById,
    importTokens,
    tokensMap,
    importTokenAddresses,
  };
};

export const useToken = (address?: string) => {
  const {
    getTokenById,
    importTokens,
    tokensMap,
    isPending: tokenQueryIsPending,
  } = useTokens();
  const { Token } = useContract();
  const [isPending, setIsPending] = useState(!getTokenById(address));
  const [token, setToken] = useState<Token | undefined>(getTokenById(address));
  useEffect(() => {
    if (!address || token?.address === address) return;
    const existing = getTokenById(address);
    if (existing) {
      setIsPending(false);
      return setToken(existing);
    }
    if (tokenQueryIsPending) return;
    fetchTokenData(Token, address)
      .then((token) => {
        setToken(token);
        importTokens([token]);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsPending(false));
  }, [
    tokensMap,
    getTokenById,
    address,
    Token,
    importTokens,
    tokenQueryIsPending,
    token,
  ]);
  return { token, isPending };
};

export const useImportTokens = (addresses: string[]) => {
  const {
    getTokenById,
    isPending: tokenQueryIsPending,
    importTokenAddresses,
  } = useTokens();
  const [isPending, setIsPending] = useState(
    addresses.every((a) => !getTokenById(a)),
  );
  const [tokens, setTokens] = useState<Token[]>();
  useEffect(() => {
    if (tokenQueryIsPending) return;
    if (isPending) {
      // If there are missing token, import them
      importTokenAddresses(addresses).finally(() => {
        setIsPending(false);
      });
    } else {
      // Next rendering get all tokens
      setTokens(addresses.map((a) => getTokenById(a)!));
    }
  }, [
    addresses,
    getTokenById,
    importTokenAddresses,
    isPending,
    tokenQueryIsPending,
  ]);
  return { tokens, isPending };
};
