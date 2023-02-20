import { useCallback, useEffect, useState } from 'react';
import { Token } from 'libs/tokens';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';
import { useWeb3 } from 'libs/web3';

export const useTokens = () => {
  const { user } = useWeb3();
  const {
    tokens: { tokensMap, importedTokens, setImportedTokens, ...props },
  } = useStore();

  const getTokenById = useCallback(
    (id: string) => (id ? tokensMap.get(id.toLowerCase()) : undefined),
    [tokensMap]
  );

  const importToken = useCallback(
    (token: Token) => {
      const exists =
        tokensMap.has(token.address) ||
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
    [tokensMap, importedTokens, setImportedTokens]
  );

  const [favoriteTokens, _setFavoriteTokens] = useState<Token[]>(
    lsService.getItem(`favoriteTokens-${user}`) || []
  );

  useEffect(() => {
    if (user) {
      _setFavoriteTokens(lsService.getItem(`favoriteTokens-${user}`) || []);
    }
  }, [user]);

  const addFavoriteToken = useCallback(
    (pair: Token) => {
      _setFavoriteTokens((prev) => {
        const newValue = [...prev, pair];
        lsService.setItem(`favoriteTokens-${user}`, newValue);
        return newValue;
      });
    },
    [user]
  );

  const removeFavoriteToken = useCallback(
    (token: Token) => {
      _setFavoriteTokens((prev) => {
        const newValue = prev.filter(
          (p) => p.address.toLowerCase() !== token.address.toLowerCase()
        );
        lsService.setItem(`favoriteTokens-${user}`, newValue);
        return newValue;
      });
    },
    [user]
  );

  return {
    ...props,
    getTokenById,
    importToken,
    addFavoriteToken,
    removeFavoriteToken,
    favoriteTokens,
    tokensMap,
  };
};
