import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { Modal, ModalHeader } from 'libs/modals/Modal';
import { ReactComponent as IconDelete } from 'assets/icons/delete.svg';

export type ModalWithdrawOrDeleteData = {
  onDelete: () => void;
  onWithdraw: () => void;
};

export const ModalWithdrawOrDelete: ModalFC<ModalWithdrawOrDeleteData> = ({
  id,
  data: { onDelete, onWithdraw },
}) => {
  const { closeModal } = useModal();

  return (
    <Modal id={id} className="grid gap-16">
      <ModalHeader id={id} />
      <IconTitleText
        variant="error"
        icon={<IconDelete />}
        title="This strategy will become inactive once the budget is removed"
        text="Delete this strategy to keep things tidy"
      />
      <button
        className="btn-primary-gradient"
        onClick={() => {
          closeModal(id);
          onDelete();
        }}
      >
        Withdraw and Delete
      </button>
      <button
        className="btn-on-surface"
        onClick={() => {
          closeModal(id);
          onWithdraw();
        }}
      >
        Withdraw Only
      </button>
    </Modal>
  );
};
