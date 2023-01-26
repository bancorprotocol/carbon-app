import { useCallback } from 'react';
import { Token } from 'libs/tokens';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';

export const useTokens = () => {
  const {
    tokens: { tokensMap, importedTokens, setImportedTokens, ...props },
  } = useStore();

  const getTokenById = useCallback(
    (id: string) => tokensMap.get(id),
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

  return {
    ...props,
    getTokenById,
    importToken,
  };
};
