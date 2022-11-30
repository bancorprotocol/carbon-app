import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { ApproveToken } from 'components/approval';
import { Button } from 'components/Button';
import { useModal } from 'modals/ModalProvider';
import { ApprovalToken, useApproval } from 'hooks/useApproval';

export type ModalCreateConfirmData = {
  approvalTokens: ApprovalToken[];
  onConfirm: Function;
};

export const ModalCreateConfirm: ModalFC<ModalCreateConfirmData> = ({
  id,
  data: { approvalTokens, onConfirm },
}) => {
  const { closeModal } = useModal();
  const { approvalQuery, approvalRequired } = useApproval(approvalTokens);

  return (
    <Modal id={id} title={'Confirm Transaction'}>
      <h3 className={'mt-30 mb-20'}>1. Approval</h3>
      <div className={'space-y-20'}>
        {approvalQuery.map(({ data, isLoading, error }, i) => (
          <ApproveToken
            key={i}
            data={data}
            isLoading={isLoading}
            error={error}
          />
        ))}
      </div>
      <h3 className={'mt-30 mb-20'}>2. Create Strategy</h3>
      <Button
        size={'lg'}
        fullWidth
        disabled={approvalRequired}
        onClick={async () => {
          await onConfirm();
          closeModal(id);
        }}
      >
        Confirm Create Strategy
      </Button>
    </Modal>
  );
};
