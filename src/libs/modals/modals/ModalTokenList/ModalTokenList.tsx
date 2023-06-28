import { ModalFC } from 'libs/modals/modals.types';
import { Token } from 'libs/tokens';
import { SearchInput } from 'components/common/searchInput';
import { useModalTokenList } from 'libs/modals/modals/ModalTokenList/useModalTokenList';
import { ModalTokenListImport } from 'libs/modals/modals/ModalTokenList/ModalTokenListImport';
import { ModalTokenListNotFound } from 'libs/modals/modals/ModalTokenList/ModalTokenListNotFound';
import { ModalTokenListContent } from 'libs/modals/modals/ModalTokenList/ModalTokenListContent';
import { ModalTokenListLoading } from 'libs/modals/modals/ModalTokenList/ModalTokenListLoading';
import { ModalTokenListError } from 'libs/modals/modals/ModalTokenList/ModalTokenListError';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { useBreakpoints } from 'hooks/useBreakpoints';

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

  return (
    <ModalOrMobileSheet id={id} title={'Select Token'}>
      <SearchInput
        autoFocus={!belowBreakpoint('md')}
        value={search}
        setValue={setSearch}
        className="mt-20 w-full rounded-8 py-10"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSelect(filteredTokens[0]);
          }
        }}
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
