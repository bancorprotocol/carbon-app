import { useMemo } from 'react';
import { carbonEvents } from 'services/events';
import { ModalFC } from 'libs/modals/modals.types';
import { Strategy } from 'libs/queries';
import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { useDeleteStrategy } from 'components/strategies/useDeleteStrategy';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { useOrder } from 'components/strategies/create/useOrder';
import { useStrategyEventData } from 'components/strategies/create/useStrategyEventData';
import { getStatusTextByTxStatus } from 'components/strategies/utils';
import { getModalDataByType } from './utils';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export type ModalConfirmStrategyData = {
  strategy: Strategy;
  type: 'delete' | 'pause';
};

export const ModalConfirmStrategy: ModalFC<ModalConfirmStrategyData> = ({
  id,
  data: { strategy, type },
}) => {
  const { closeModal } = useModal();
  const data = getModalDataByType(type);
  const { pauseStrategy, isProcessing, setIsProcessing, updateMutation } =
    useUpdateStrategy();

  const { deleteStrategy, deleteMutation } = useDeleteStrategy();
  const isAwaiting =
    type === 'delete' ? deleteMutation.isLoading : updateMutation.isLoading;
  const isLoading = isAwaiting || isProcessing;
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
          setIsProcessing,
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

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <ModalOrMobileSheet id={id} title={data?.modalTitle}>
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
          loading={isLoading}
          loadingChildren={loadingChildren}
          className="mt-32"
          variant={'white'}
          size="lg"
          fullWidth
        >
          {data?.actionButton}
        </Button>
        <Button
          onClick={() => closeModal(id)}
          disabled={isLoading}
          className="mt-16"
          variant="black"
          size="lg"
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </ModalOrMobileSheet>
  );
};
