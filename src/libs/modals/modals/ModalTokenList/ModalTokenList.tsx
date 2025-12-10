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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const selected = '.token-select[aria-selected]';
      const getSelected = () => document.querySelector<HTMLElement>(selected);
      const getFirst = () =>
        document.querySelector<HTMLElement>('.token-select');
      const el = getSelected() || getFirst();
      el?.click();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const getAll = () =>
        document.querySelectorAll<HTMLElement>('.token-select');
      const all = Array.from(getAll());
      const current = all.findIndex((item) => item.ariaSelected);
      // Always fallback on first because list is too long
      const next = e.key === 'ArrowDown' ? current + 1 : current - 1;
      all[current]?.removeAttribute('aria-selected');
      all[next]?.setAttribute('aria-selected', 'true');
      all[next]?.scrollIntoView({ block: 'center' });
    }
  }, []);

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
