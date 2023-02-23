import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { ModalEditStrategyBuySellBlock } from './ModalEditStrategyBuySellBlock';
import { useCreateStrategy } from 'components/strategies/create/useCreateStrategy';

export type ModalEditStrategyData = {
  strategy: Strategy;
};

export const ModalEditStrategy: ModalFC<ModalEditStrategyData> = ({
  id,
  data: { strategy },
}) => {
  const { closeModal } = useModal();

  const handleOnActionClick = () => {
    closeModal(id);
  };
  const { order0, order1 } = useCreateStrategy();

  return (
    <Modal className="dark:bg-emphasis/60" id={id} title={'Unpause Strategy'}>
      <div className="mt-24 flex flex-col items-center space-y-20 text-center font-weight-500">
        <ModalEditStrategyBuySellBlock
          buy
          base={strategy?.token0}
          quote={strategy?.token1}
          order={order0}
          balance={strategy.order0.balance}
        />
        <ModalEditStrategyBuySellBlock
          base={strategy?.token1}
          quote={strategy?.token0}
          order={order1}
          balance={strategy.order1.balance}
        />
        <Button
          onClick={handleOnActionClick}
          className="mt-32"
          variant="white"
          size="lg"
          fullWidth
        >
          Renew Strategy
        </Button>
        <Button
          onClick={() => closeModal(id)}
          className="mt-16"
          variant="black"
          size="lg"
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
