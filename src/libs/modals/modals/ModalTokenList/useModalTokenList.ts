import { useCallback, useMemo, useState } from 'react';
import { Token } from 'libs/tokens';
import { useTokens } from 'hooks/useTokens';
import { useModal } from 'hooks/useModal';
import Fuse from 'fuse.js';
import { utils } from 'ethers';
import { ModalTokenListData } from 'libs/modals/modals/ModalTokenList/ModalTokenList';
import { orderBy } from 'lodash';

const SEARCH_KEYS = [
  {
    name: 'symbol',
    weight: 0.6,
  },
  {
    name: 'name',
    weight: 0.4,
  },
];

type Props = {
  id: string;
  data: ModalTokenListData;
};

export const useModalTokenList = ({ id, data }: Props) => {
  const { tokens, isLoading, isError, error } = useTokens();
  const { onClick, excludedTokens = [], includedTokens = [] } = data;
  const { closeModal } = useModal();
  const [search, setSearch] = useState('');

  const onSelect = useCallback(
    (token: Token) => {
      onClick(token);
      closeModal(id);
    },
    [onClick, closeModal, id]
  );

  const sanitizedTokens = useMemo(
    () =>
      tokens.filter(
        (token) =>
          (includedTokens.length === 0 ||
            includedTokens.includes(token.address)) &&
          !excludedTokens.includes(token.address)
      ),
    [tokens, excludedTokens, includedTokens]
  );

  const fuseIndex = useMemo(
    () => Fuse.createIndex(SEARCH_KEYS, sanitizedTokens),
    [sanitizedTokens]
  );

  const fuse = useMemo(
    () =>
      new Fuse(
        sanitizedTokens,
        {
          keys: SEARCH_KEYS,
          threshold: 0.3,
          distance: 50,
        },
        fuseIndex
      ),
    [sanitizedTokens, fuseIndex]
  );

  const filteredTokens = useMemo(() => {
    if (search.length === 0) {
      return orderBy(sanitizedTokens, 'symbol', 'asc');
    }

    const isAddress = utils.isAddress(search);
    if (isAddress) {
      const found = sanitizedTokens.find(
        (token) => token.address.toLowerCase() === search.toLowerCase()
      );
      if (found) {
        return [found];
      }
      return [];
    }

    const result = fuse.search(search);
    return result.map((result) => result.item);
  }, [search, sanitizedTokens, fuse]);

  const showImportToken = useMemo(() => {
    const isValidAddress = utils.isAddress(search);
    return (
      isValidAddress &&
      !filteredTokens.find(
        (token) => token.address.toLowerCase() === search.toLowerCase()
      )
    );
  }, [search, filteredTokens]);

  const showNoResults = useMemo(
    () => !showImportToken && filteredTokens.length === 0,
    [showImportToken, filteredTokens]
  );

  return {
    search,
    setSearch,
    showImportToken,
    showNoResults,
    filteredTokens,
    onSelect,
    isLoading,
    isError,
    error,
  };
};
