import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Token } from 'libs/tokens';
import { SearchInput } from 'components/common/searchInput';
import { useModal } from 'libs/modals/ModalProvider';

export type TradePair = {
  baseToken: Token;
  quoteToken: Token;
};

export type ModalTradeTokenListData = {
  onClick: (tradePair: TradePair) => void;
  tradePairs?: TradePair[];
};

export const ModalTradeTokenList: ModalFC<ModalTradeTokenListData> = ({
  id,
  data,
}) => {
  const { closeModal } = useModal();
  const handleSelect = (tradePair: TradePair) => {
    data.onClick(tradePair);
    closeModal(id);
  };
  return (
    <Modal id={id} title={'Select Token'}>
      <SearchInput
        value={''}
        setValue={() => {}}
        className="mt-20 w-full rounded-8 py-10"
      />

      <div>
        {data.tradePairs?.map((tradePair, i) => (
          <div key={i}>
            <button onClick={() => handleSelect(tradePair)}>
              {tradePair.baseToken.symbol}/{tradePair.quoteToken.symbol}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
};
