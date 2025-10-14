import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';
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
    <ModalOrMobileSheet id={id}>
      <div className="my-20">
        <IconTitleText
          variant="error"
          icon={<IconDelete />}
          title="This strategy will become inactive once the budget is removed"
          text="Delete this strategy to keep things tidy"
        />
      </div>
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
        className="btn-secondary-gradient"
        onClick={() => {
          closeModal(id);
          onWithdraw();
        }}
      >
        Withdraw Only
      </button>
    </ModalOrMobileSheet>
  );
};
