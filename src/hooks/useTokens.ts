import { useCallback, useEffect, useState } from 'react';
import { Token } from 'libs/tokens';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';
import { useWagmi } from 'libs/wagmi';
import { useContract } from './useContract';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { getAddress } from 'ethers';

export const useTokens = () => {
  const { user } = useWagmi();
  const {
    tokens: { tokensMap, setImportedTokens, ...props },
  } = useStore();
  const { Token } = useContract();

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

  /** Get tokens and import missing one */
  const getAllTokens = async (addresses: Iterable<string>) => {
    const missingTokens = new Set<string>();
    const tokens = new Map<string, Token>();
    for (const address of addresses) {
      const token = getTokenById(address);
      if (token) tokens.set(address, token);
      else missingTokens.add(address);
    }
    if (missingTokens.size) {
      const getTokens = Array.from(missingTokens).map((address) => {
        return fetchTokenData(Token, address);
      });
      const responses = await Promise.allSettled(getTokens);
      for (const res of responses) {
        if (res.status === 'fulfilled') {
          tokens.set(res.value.address, res.value);
        } else {
          console.error(res.reason);
        }
      }
      // importTokens will filter out existing tokens
      importTokens(Object.values(tokens));
    }
    return tokens;
  };

  const [favoriteTokens, _setFavoriteTokens] = useState<Token[]>(
    lsService.getItem(`favoriteTokens-${user}`) || [],
  );

  const addFavoriteToken = useCallback(
    (token: Token) => {
      _setFavoriteTokens((prev) => {
        const updatedFavoriteTokens = [...prev, token];
        lsService.setItem(`favoriteTokens-${user}`, updatedFavoriteTokens);
        return updatedFavoriteTokens;
      });
    },
    [user],
  );

  const removeFavoriteToken = useCallback(
    (token: Token) => {
      _setFavoriteTokens((prev) => {
        const updatedFavoriteTokens = prev.filter(
          (p) => p.address.toLowerCase() !== token.address.toLowerCase(),
        );
        lsService.setItem(`favoriteTokens-${user}`, updatedFavoriteTokens);
        return updatedFavoriteTokens;
      });
    },
    [user],
  );

  return {
    ...props,
    getTokenById,
    importTokens,
    addFavoriteToken,
    removeFavoriteToken,
    favoriteTokens,
    tokensMap,
    getAllTokens,
  };
};

export const useToken = (address?: string) => {
  const {
    getTokenById,
    getAllTokens,
    isPending: tokenQueryIsPending,
  } = useTokens();
  const [isPending, setIsPending] = useState(!getTokenById(address));
  const [token, setToken] = useState<Token | undefined>(getTokenById(address));
  useEffect(() => {
    if (!address) return;
    const existing = getTokenById(address);
    if (existing) {
      setIsPending(false);
      return setToken(existing);
    }
    if (tokenQueryIsPending) return;
    getAllTokens([address]).finally(() => setIsPending(false));
  }, [getTokenById, address, getAllTokens, tokenQueryIsPending]);
  return { token, isPending };
};
