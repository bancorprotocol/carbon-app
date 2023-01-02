import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { ApproveToken } from 'components/common/approval';
import { Button } from 'components/common/button';
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
      <h3 className={'text-secondary my-10'}>Approve Tokens</h3>
      <div className={'mb-20 space-y-20'}>
        {approvalQuery.map(({ data, isLoading, error }, i) => (
          <ApproveToken
            key={i}
            data={data}
            isLoading={isLoading}
            error={error}
          />
        ))}
      </div>

      <Button
        size={'lg'}
        variant={'secondary'}
        fullWidth
        disabled={approvalRequired}
        onClick={async () => {
          await onConfirm();
          closeModal(id);
        }}
      >
        Create Strategy
      </Button>
    </Modal>
  );
};
