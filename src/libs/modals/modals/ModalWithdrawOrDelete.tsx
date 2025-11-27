import { useModal } from 'hooks/useModal';
import { ModalProps } from 'libs/modals/modals.types';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { Modal, ModalHeader } from 'libs/modals/Modal';
import IconDelete from 'assets/icons/delete.svg?react';

interface ModalWithdrawOrDeleteData {
  onDelete: () => void;
  onWithdraw: () => void;
}

export default function ModalWithdrawOrDelete({
  id,
  data: { onDelete, onWithdraw },
}: ModalProps<ModalWithdrawOrDeleteData>) {
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
}
