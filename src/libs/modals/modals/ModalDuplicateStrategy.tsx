import { ModalFC } from 'libs/modals/modals.types';
import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export type ModalDuplicateStrategyData = {
  strategyId: string;
};

export const ModalDuplicateStrategy: ModalFC<ModalDuplicateStrategyData> = ({
  id,
  data: { strategyId },
}) => {
  const { closeModal } = useModal();

  return (
    <ModalOrMobileSheet id={id}>
      <h2 className={'my-16'}>Duplicate Strategy</h2>
      <p className="text-secondary my-20 flex w-full items-center">
        Select your option.
      </p>
    </ModalOrMobileSheet>
  );
};
