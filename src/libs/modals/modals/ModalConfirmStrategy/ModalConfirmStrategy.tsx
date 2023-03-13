import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { Strategy } from 'libs/queries';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { useDeleteStrategy } from 'components/strategies/useDeleteStrategy';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { getModalDataByType } from './utils';

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

  const handleOnActionClick = () => {
    switch (type) {
      case 'pause':
        pauseStrategy(strategy);
        break;
      case 'delete':
        deleteStrategy(strategy);
        break;
    }

    closeModal(id);
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
