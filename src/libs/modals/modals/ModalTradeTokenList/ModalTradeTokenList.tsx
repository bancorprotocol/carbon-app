import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Token } from 'libs/tokens';
import { SearchInput } from 'components/common/searchInput';
import { useModalTradeTokenList } from 'libs/modals/modals/ModalTradeTokenList/useModalTradeTokenList';
import { ModalTokenListError } from 'libs/modals/modals/ModalTokenList/ModalTokenListError';
import { ModalTradeTokenListContent } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenListContent';
import { ModalTokenListLoading } from 'libs/modals/modals/ModalTokenList/ModalTokenListLoading';
import { useTranslation } from 'libs/translations';

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
  const { t } = useTranslation();
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
    <Modal id={id} title={t('modals.selectTokenPair.modalTitle')}>
      <SearchInput
        autoFocus
        value={search}
        setValue={setSearch}
        className="mt-20 w-full rounded-8 py-10"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSelect(tradePairs[0]);
          }
        }}
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
    </Modal>
  );
};
