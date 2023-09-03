import { useCallback, useState } from 'react';
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
    (id?: string) => (id ? tokensMap.get(id.toLowerCase()) : undefined),
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

  const addFavoriteToken = useCallback(
    (token: Token) => {
      _setFavoriteTokens((prev) => {
        const updatedFavoriteTokens = [...prev, token];
        lsService.setItem(`favoriteTokens-${user}`, updatedFavoriteTokens);
        return updatedFavoriteTokens;
      });
    },
    [user]
  );

  const removeFavoriteToken = useCallback(
    (token: Token) => {
      _setFavoriteTokens((prev) => {
        const updatedFavoriteTokens = prev.filter(
          (p) => p.address.toLowerCase() !== token.address.toLowerCase()
        );
        lsService.setItem(`favoriteTokens-${user}`, updatedFavoriteTokens);
        return updatedFavoriteTokens;
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
