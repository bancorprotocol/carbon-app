import { ModalFC } from 'libs/modals/modals.types';
import { Token } from 'libs/tokens';
import { useModalTokenList } from 'libs/modals/modals/ModalTokenList/useModalTokenList';
import { ModalTokenListImport } from 'libs/modals/modals/ModalTokenList/ModalTokenListImport';
import { ModalTokenListNotFound } from 'libs/modals/modals/ModalTokenList/ModalTokenListNotFound';
import { ModalTokenListContent } from 'libs/modals/modals/ModalTokenList/ModalTokenListContent';
import { ModalTokenListLoading } from 'libs/modals/modals/ModalTokenList/ModalTokenListLoading';
import { ModalTokenListError } from 'libs/modals/modals/ModalTokenList/ModalTokenListError';
import { SearchInput } from 'components/common/searchInput';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { KeyboardEvent } from 'react';

export type ModalTokenListData = {
  onClick: (token: Token) => void;
  excludedTokens?: string[];
  includedTokens?: string[];
  isBaseToken?: boolean;
};

export const ModalTokenList: ModalFC<ModalTokenListData> = ({ id, data }) => {
  const { belowBreakpoint } = useBreakpoints();

  const {
    search,
    setSearch,
    showImportToken,
    showNoResults,
    filteredTokens,
    onSelect,
    isError,
    isLoading,
    addFavoriteToken,
    removeFavoriteToken,
    favoriteTokens,
    popularTokens,
  } = useModalTokenList({ id, data });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !!filteredTokens.length) {
      onSelect(filteredTokens[0]);
    }
  };

  return (
    <ModalOrMobileSheet id={id} title="Select Token">
      <SearchInput
        aria-labelledby="modal-title"
        aria-description="search by token symbol"
        autoFocus={!belowBreakpoint('md')}
        value={search}
        setValue={setSearch}
        className="rounded-8"
        onKeyDown={handleKeyDown}
      />
      {isError ? (
        <ModalTokenListError />
      ) : isLoading ? (
        <ModalTokenListLoading />
      ) : showImportToken ? (
        <ModalTokenListImport address={search} />
      ) : showNoResults ? (
        <ModalTokenListNotFound />
      ) : (
        <ModalTokenListContent
          tokens={{
            all: filteredTokens,
            favorites: favoriteTokens,
            popular: popularTokens,
          }}
          onSelect={onSelect}
          search={search}
          onAddFavorite={addFavoriteToken}
          onRemoveFavorite={removeFavoriteToken}
        />
      )}
    </ModalOrMobileSheet>
  );
};
