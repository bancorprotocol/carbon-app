import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Token } from 'libs/tokens';
import { SearchInput } from 'components/common/searchInput';
import { useModalTradeTokenList } from 'libs/modals/modals/ModalTradeTokenList/useModalTradeTokenList';
import { ModalTokenListError } from 'libs/modals/modals/ModalTokenList/ModalTokenListError';
import { ModalTradeTokenListContent } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenListContent';
import { ModalTokenListLoading } from 'libs/modals/modals/ModalTokenList/ModalTokenListLoading';

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
  const { tradePairs, isLoading, isError, handleSelect, search, setSearch } =
    useModalTradeTokenList({ id, data });

  return (
    <Modal id={id} title={'Select Token Pair'}>
      <SearchInput
        value={search}
        setValue={setSearch}
        className="mt-20 w-full rounded-8 py-10"
      />

      {isError ? (
        <ModalTokenListError />
      ) : isLoading ? (
        <ModalTokenListLoading />
      ) : (
        <ModalTradeTokenListContent
          search={search}
          tradePairs={tradePairs}
          handleSelect={handleSelect}
        />
      )}
    </Modal>
  );
};
