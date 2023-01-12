import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Token } from 'libs/tokens';
import { SearchInput } from 'components/common/searchInput';
import { useModalTokenList } from 'libs/modals/modals/ModalTokenList/useModalTokenList';
import { ModalTokenListImport } from 'libs/modals/modals/ModalTokenList/ModalTokenListImport';
import { ModalTokenListNotFound } from 'libs/modals/modals/ModalTokenList/ModalTokenListNotFound';
import { ModalTokenListContent } from 'libs/modals/modals/ModalTokenList/ModalTokenListContent';
import { ModalTokenListLoading } from 'libs/modals/modals/ModalTokenList/ModalTokenListLoading';
import { ModalTokenListError } from 'libs/modals/modals/ModalTokenList/ModalTokenListError';

export type ModalTokenListData = {
  onClick: (token: Token) => void;
  excludedTokens?: string[];
  includedTokens?: string[];
};

export const ModalTokenList: ModalFC<ModalTokenListData> = ({ id, data }) => {
  const {
    search,
    setSearch,
    showImportToken,
    showNoResults,
    filteredTokens,
    onSelect,
    isError,
    isLoading,
  } = useModalTokenList({ id, data });

  return (
    <Modal id={id} title={'Select Token'}>
      <SearchInput
        autoFocus
        value={search}
        setValue={setSearch}
        className="mt-20 w-full rounded-8 py-10"
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
          tokens={filteredTokens}
          onSelect={onSelect}
          search={search}
        />
      )}
    </Modal>
  );
};
