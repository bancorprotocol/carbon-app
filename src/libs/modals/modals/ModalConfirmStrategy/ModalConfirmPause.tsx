import { carbonEvents } from 'services/events';
import { ModalFC } from 'libs/modals/modals.types';
import { Strategy } from 'libs/queries';
import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';
import { useUpdateStrategy } from 'components/strategies/useUpdateStrategy';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { getStatusTextByTxStatus } from 'components/strategies/utils';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
import { StrategyEditEventType } from 'services/events/types';
import { ReactComponent as IconPause } from 'assets/icons/pause.svg';

export type ModalConfirmPauseData = {
  strategy: Strategy;
  strategyEvent: StrategyEditEventType;
};

export const ModalConfirmPause: ModalFC<ModalConfirmPauseData> = ({
  id,
  data,
}) => {
  const { strategy, strategyEvent } = data;
  const { closeModal } = useModal();
  const { pauseStrategy, isProcessing, updateMutation } = useUpdateStrategy();

  const isAwaiting = updateMutation.isLoading;
  const isLoading = isAwaiting || isProcessing;

  const handleOnActionClick = () => {
    pauseStrategy(
      strategy,
      () => carbonEvents.strategyEdit.strategyPause(strategyEvent),
      () => closeModal(id)
    );
  };

  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  return (
    <ModalOrMobileSheet id={id} title="Pause Strategy">
      <IconTitleText
        icon={<IconPause className="h-24 w-24" />}
        title="Are you sure you would like to pause your strategy?"
        text="This will prevent your strategy from being traded against, however you will retain access to any associated funds."
      />
      <Button
        onClick={handleOnActionClick}
        loading={isLoading}
        loadingChildren={loadingChildren}
        variant="white"
        size="lg"
        fullWidth
      >
        Pause Strategy
      </Button>
      <Button
        onClick={() => closeModal(id)}
        disabled={isLoading}
        variant="black"
        size="lg"
        fullWidth
      >
        Cancel
      </Button>
    </ModalOrMobileSheet>
  );
};
