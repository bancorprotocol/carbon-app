import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { Token } from 'tokens';
import { SearchInput } from 'components/SearchInput';
import { useModalTokenList } from './useModalTokenList';
import { ModalTokenListImport } from './ModalTokenListImport';
import { ModalTokenListNotFound } from './ModalTokenListNotFound';
import { ModalTokenListContent } from './ModalTokenListContent';
import { ModalTokenListLoading } from './ModalTokenListLoading';
import { ModalTokenListError } from './ModalTokenListError';

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
