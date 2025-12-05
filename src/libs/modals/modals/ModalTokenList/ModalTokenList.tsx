import { ModalProps } from 'libs/modals/modals.types';
import { useModalTokenList } from 'libs/modals/modals/ModalTokenList/useModalTokenList';
import { ModalTokenListImport } from 'libs/modals/modals/ModalTokenList/ModalTokenListImport';
import { ModalTokenListNotFound } from 'libs/modals/modals/ModalTokenList/ModalTokenListNotFound';
import { ModalTokenListContent } from 'libs/modals/modals/ModalTokenList/ModalTokenListContent';
import { ModalTokenListLoading } from 'libs/modals/modals/ModalTokenList/ModalTokenListLoading';
import { ModalTokenListError } from 'libs/modals/modals/ModalTokenList/ModalTokenListError';
import { ModalTokenImportNotification } from 'libs/modals/modals/ModalTokenList/ModalTokenImportNotification';
import { SearchInput } from 'components/common/searchInput';
import { Modal, ModalHeader } from 'libs/modals/Modal';
import { KeyboardEvent, useCallback } from 'react';
import { useStore } from 'store';
import { ModalTokenListData } from './types';

export default function ModalTokenList({
  id,
  data,
}: ModalProps<ModalTokenListData>) {
  const {
    tokens: { isError, isPending },
  } = useStore();
  const {
    search,
    setSearch,
    showImportToken,
    showNoResults,
    filteredTokens,
    onSelect,
    addFavoriteToken,
    removeFavoriteToken,
    favoriteTokens,
    popularTokens,
    duplicateSymbols,
  } = useModalTokenList({ id, data });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !!filteredTokens.length) {
        onSelect(filteredTokens[0]);
      }
    },
    [filteredTokens, onSelect],
  );

  return (
    <Modal id={id} className="grid content-start gap-16 md:w-500 h-[70vh]">
      <ModalHeader id={id}>
        <h2 id="modal-title">Select Token</h2>
      </ModalHeader>
      <SearchInput
        aria-labelledby="modal-title"
        value={search}
        setValue={setSearch}
        className="rounded-md"
        onKeyDown={handleKeyDown}
      />
      {!showNoResults && !showImportToken && <ModalTokenImportNotification />}

      {isError ? (
        <ModalTokenListError />
      ) : isPending ? (
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
          duplicateSymbols={duplicateSymbols}
          onSelect={onSelect}
          search={search}
          onAddFavorite={addFavoriteToken}
          onRemoveFavorite={removeFavoriteToken}
        />
      )}
    </Modal>
  );
}
