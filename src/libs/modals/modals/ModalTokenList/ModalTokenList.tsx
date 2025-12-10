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
import { ModalTokenListData } from './types';
import { Token } from 'libs/tokens';
import { useTokens } from 'hooks/useTokens';
import { useModal } from 'hooks/useModal';

export default function ModalTokenList({
  id,
  data,
}: ModalProps<ModalTokenListData>) {
  const { closeModal } = useModal();
  const { isError, isPending } = useTokens();

  const { search, setSearch, showImportToken, all, duplicateSymbols } =
    useModalTokenList(data.excludedTokens);

  const select = useCallback(
    (token: Token) => {
      data.onClick(token);
      closeModal(id);
    },
    [data, closeModal, id],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !!all.size) {
        const token = all
          .values()
          .take(0)
          .find(() => true);
        if (token) select(token);
      }
      // TODO: handle keydown, up, start & end
    },
    [all, select],
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
      {!!all.size && !showImportToken && <ModalTokenImportNotification />}

      {isError ? (
        <ModalTokenListError />
      ) : isPending ? (
        <ModalTokenListLoading />
      ) : showImportToken ? (
        <ModalTokenListImport address={search} />
      ) : !all.size ? (
        <ModalTokenListNotFound />
      ) : (
        <ModalTokenListContent
          all={all}
          duplicateSymbols={duplicateSymbols}
          select={select}
          search={search}
        />
      )}
    </Modal>
  );
}
