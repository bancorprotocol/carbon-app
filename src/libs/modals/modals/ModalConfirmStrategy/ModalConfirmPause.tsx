import { ModalFC } from 'libs/modals/modals.types';
import { AnyStrategy } from 'components/strategies/common/types';
import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';
import { usePauseStrategy } from 'components/strategies/usePauseStrategy';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { getStatusTextByTxStatus } from 'components/strategies/utils';
import { Modal, ModalHeader } from 'libs/modals/Modal';
import { ReactComponent as IconPause } from 'assets/icons/pause.svg';

export type ModalConfirmPauseData = {
  strategy: AnyStrategy;
};

export const ModalConfirmPause: ModalFC<ModalConfirmPauseData> = ({
  id,
  data,
}) => {
  const { strategy } = data;
  const { closeModal } = useModal();
  const { pauseStrategy, isProcessing, updateMutation } = usePauseStrategy();

  const isPending = updateMutation.isPending;
  const isLoading = isPending || isProcessing;

  const handleOnActionClick = () => {
    pauseStrategy(
      strategy,
      () => {},
      () => closeModal(id),
    );
  };

  const loadingChildren = getStatusTextByTxStatus(isPending, isProcessing);

  return (
    <Modal id={id} className="grid gap-16">
      <ModalHeader id={id}>
        <h2>Pause Strategy</h2>
      </ModalHeader>
      <IconTitleText
        icon={<IconPause className="size-24" />}
        title="Are you sure you would like to pause your strategy?"
        text="This will prevent your strategy from being traded against, however you will retain access to any associated funds."
      />
      <Button
        onClick={handleOnActionClick}
        loading={isLoading}
        loadingChildren={loadingChildren}
        variant="success"
        size="lg"
        fullWidth
        data-testid="pause-strategy-btn"
      >
        Pause Strategy
      </Button>
      <button
        onClick={() => closeModal(id)}
        disabled={isLoading}
        className="btn-on-surface text-16"
      >
        Cancel
      </button>
    </Modal>
  );
};
