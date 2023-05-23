import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { useDeleteStrategy } from 'components/strategies/useDeleteStrategy';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { getModalDataByType } from './utils';
import { useOrder } from 'components/strategies/create/useOrder';
import { carbonEvents } from 'services/events';

import { useStrategyEventData } from 'components/strategies/create/useStrategyEventData';

export type ModalConfirmStrategyData = {
  strategy: Strategy;
  type: 'delete' | 'pause';
};

export const ModalConfirmStrategy: ModalFC<ModalConfirmStrategyData> = ({
  id,
  data: { strategy, type },
}) => {
  const { closeModal } = useModal();
  const {
    pauseStrategy,
    strategyTxStatus,
    setStrategyTxStatus,
    isCtaDisabled,
  } = useUpdateStrategy();
  const { deleteStrategy } = useDeleteStrategy();
  const data = getModalDataByType(type, strategyTxStatus);
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
        pauseStrategy(
          strategy,
          () => {
            carbonEvents.strategyEdit.strategyPause({
              ...strategyEventData,
              strategyId: strategy.id,
            });
          },
          () => closeModal(id)
        );
        break;
      case 'delete':
        deleteStrategy(
          strategy,
          setStrategyTxStatus,
          () => {
            carbonEvents.strategyEdit.strategyDelete({
              ...strategyEventData,
              strategyId: strategy.id,
            });
          },
          () => closeModal(id)
        );
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
          disabled={isCtaDisabled}
          loading={isCtaDisabled}
          className="mt-32"
          variant={isCtaDisabled ? 'black' : 'white'}
          size="lg"
          fullWidth
        >
          {data?.actionButton}
        </Button>
        <Button
          onClick={() => closeModal(id)}
          disabled={isCtaDisabled}
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
