import { useModal } from 'modals/ModalProvider';
import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { CreateStrategy } from 'elements/strategies/create';

export type ModalCreateStrategyData = {
  foo: string;
  bar: string;
};

export const ModalCreateStrategy: ModalFC<ModalCreateStrategyData> = ({
  id,
  data,
}) => {
  const { closeModal, openModal } = useModal();

  return (
    <Modal id={id}>
      <div>
        <h2>Create Strategy</h2>
      </div>
      <CreateStrategy />
    </Modal>
  );
};
