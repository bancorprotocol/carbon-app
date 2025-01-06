import { utils } from 'ethers';
import { useCallback, useState } from 'react';
import { Token } from 'libs/tokens';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';
import { useWagmi } from 'libs/wagmi';

export const useTokens = () => {
  const { user } = useWagmi();
  const {
    tokens: { tokensMap, setImportedTokens, ...props },
  } = useStore();

  const getTokenById = useCallback(
    (id?: string) => (id ? tokensMap.get(id.toLowerCase()) : undefined),
    [tokensMap]
  );

  const importTokens = useCallback(
    (tokens: Token[]) => {
      const missing: Token[] = [];
      for (const token of tokens) {
        if (getTokenById(token.address)) continue;
        const normalizedAddress = utils.getAddress(token.address);
        missing.push({ ...token, address: normalizedAddress });
      }

      const lsImportedTokens = lsService.getItem('importedTokens') ?? [];
      const newTokens = [...lsImportedTokens, ...missing];
      setImportedTokens(newTokens);
      lsService.setItem('importedTokens', newTokens);
    },
    [getTokenById, setImportedTokens]
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
    importTokens,
    addFavoriteToken,
    removeFavoriteToken,
    favoriteTokens,
    tokensMap,
  };
};
