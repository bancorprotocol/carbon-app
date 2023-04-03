import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { useDeleteStrategy } from 'components/strategies/useDeleteStrategy';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { getModalDataByType } from './utils';
import { useStrategyEventData } from 'components/strategies/create/useStrategyEventData';
import { useOrder } from 'components/strategies/create/useOrder';
import { sendEvent } from 'services/googleTagManager';

export type ModalConfirmStrategyData = {
  strategy: Strategy;
  type: 'delete' | 'pause';
};

export const ModalConfirmStrategy: ModalFC<ModalConfirmStrategyData> = ({
  id,
  data: { strategy, type },
}) => {
  const { closeModal } = useModal();
  const { pauseStrategy } = useUpdateStrategy();
  const { deleteStrategy } = useDeleteStrategy();
  const data = getModalDataByType(type);

  const order0 = useOrder(strategy.order0);
  const order1 = useOrder(strategy.order1);
  const strategyEventData = useStrategyEventData({
    base: strategy.base,
    quote: strategy.quote,
    order0,
    order1,
  });
  const handleOnActionClick = () => {
    switch (type) {
      case 'pause':
        pauseStrategy(strategy, () => {
          sendEvent('strategyEdit', 'strategy_pause', strategyEventData);
          closeModal(id);
        });
        break;
      case 'delete':
        deleteStrategy(strategy, () => {
          sendEvent('strategyEdit', 'strategy_delete', strategyEventData);
          closeModal(id);
        });
        break;
    }
  };

  return (
    <Modal id={id} title={data?.modalTitle}>
      <div className="mt-24 flex flex-col items-center text-center font-weight-500">
        <IconTitleText
          variant={data?.variant}
          icon={data?.icon}
          title={data?.title || ''}
          text={data?.content}
        />
        {data?.additionalContent}
        <Button
          onClick={handleOnActionClick}
          className="mt-32"
          variant="white"
          size="lg"
          fullWidth
        >
          {data?.actionButton}
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
