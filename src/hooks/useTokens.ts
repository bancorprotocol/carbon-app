import { useCallback, useEffect, useState } from 'react';
import { Token } from 'libs/tokens';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';
import { useWagmi } from 'libs/wagmi';
import { useContract } from './useContract';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { getAddress } from 'libs/ton-tg/address';

export const useTokens = () => {
  const { user } = useWagmi();
  const {
    tokens: { tokensMap, setImportedTokens, ...props },
  } = useStore();

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
  };
};

export const useToken = (address?: string) => {
  const {
    getTokenById,
    importTokens,
    isPending: tokenQueryIsPending,
  } = useTokens();
  const { Token } = useContract();
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
    fetchTokenData(Token, address)
      .then((token) => {
        setToken(token);
        importTokens([token]);
      })
      .finally(() => setIsPending(false));
  }, [getTokenById, address, Token, importTokens, tokenQueryIsPending]);
  return { token, isPending };
};
