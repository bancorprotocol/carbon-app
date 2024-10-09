import { useModal } from 'hooks/useModal';
import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
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
      <Button
        variant="success"
        fullWidth
        onClick={() => {
          closeModal(id);
          onDelete();
        }}
      >
        Withdraw and Delete
      </Button>
      <Button
        variant="black"
        fullWidth
        onClick={() => {
          closeModal(id);
          onWithdraw();
        }}
      >
        Withdraw Only
      </Button>
    </ModalOrMobileSheet>
  );
};
