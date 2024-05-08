import { ModalFC } from 'libs/modals/modals.types';
import { Token } from 'libs/tokens';
import { useModalTradeTokenList } from 'libs/modals/modals/ModalTradeTokenList/useModalTradeTokenList';
import { ModalTokenListError } from 'libs/modals/modals/ModalTokenList/ModalTokenListError';
import { ModalTradeTokenListContent } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenListContent';
import { ModalTokenListLoading } from 'libs/modals/modals/ModalTokenList/ModalTokenListLoading';
import { SearchInput } from 'components/common/searchInput';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { useBreakpoints } from 'hooks/useBreakpoints';

export type TradePair = {
  baseToken: Token;
  quoteToken: Token;
};

export type ModalTradeTokenListData = {
  onClick: (tradePair: TradePair) => void;
};

export const ModalTradeTokenList: ModalFC<ModalTradeTokenListData> = ({
  id,
  data,
}) => {
  const { belowBreakpoint } = useBreakpoints();
  const {
    tradePairs,
    isLoading,
    isError,
    handleSelect,
    search,
    setSearch,
    tradePairsPopular,
    favoritePairs,
    addFavoritePair,
    removeFavoritePair,
  } = useModalTradeTokenList({ id, data });

  return (
    <ModalOrMobileSheet id={id} title="Select Token Pair">
      <SearchInput
        autoFocus={!belowBreakpoint('md')}
        value={search}
        setValue={setSearch}
        className="rounded-8"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSelect(tradePairs[0]);
        }}
        aria-label="Search Token Pair"
        data-testid="search-token-pair"
      />

      {isError ? (
        <ModalTokenListError />
      ) : isLoading ? (
        <ModalTokenListLoading />
      ) : (
        <ModalTradeTokenListContent
          search={search}
          tradePairs={{
            all: tradePairs,
            favorites: favoritePairs,
            popular: tradePairsPopular,
          }}
          handleSelect={handleSelect}
          onAddFavorite={addFavoritePair}
          onRemoveFavorite={removeFavoritePair}
        />
      )}
    </ModalOrMobileSheet>
  );
};
