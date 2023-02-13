import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { ReactComponent as IconWarning } from 'assets/icons/pause.svg';
import { Strategy } from 'libs/queries';
import { useUpdate } from 'components/strategies/update/useUpdateStrategy';

export type ModalPauseStrategyData = {
  strategy: Strategy;
};

export const ModalPauseStrategy: ModalFC<ModalPauseStrategyData> = ({
  id,
  data: { strategy },
}) => {
  const { closeModal } = useModal();
  const { pauseStrategy } = useUpdate();

  const handleOnPauseStrategyClick = () => {
    pauseStrategy(strategy);
    closeModal(id);
  };

  return (
    <Modal id={id} title="Pause Strategy">
      <div className="mt-24 flex flex-col items-center text-center font-weight-500">
        <div className="mb-16 flex flex h-48 w-48 items-center justify-center rounded-full bg-white/25">
          <IconWarning className="h-16 w-16" />
        </div>
        <div className="text-18">
          Are you sure you would like to pause your strategy?
        </div>
        <div className="text-14 font-weight-400 text-white/80">
          This will pause the strategy but you will maintain access to any
          associated funds
        </div>
        <Button
          onClick={handleOnPauseStrategyClick}
          className="mt-32"
          variant="white"
          size="lg"
          fullWidth
        >
          Pause Strategy
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
