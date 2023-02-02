import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { ApproveToken } from 'components/common/approval';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { ApprovalToken, useApproval } from 'hooks/useApproval';

export type ModalCreateConfirmData = {
  approvalTokens: ApprovalToken[];
  onConfirm: Function;
  buttonLabel?: string;
};

export const ModalConfirm: ModalFC<ModalCreateConfirmData> = ({
  id,
  data: { approvalTokens, onConfirm, buttonLabel = 'Confirm' },
}) => {
  const { closeModal } = useModal();
  const { approvalQuery, txSuccess, setTxSuccess } =
    useApproval(approvalTokens);

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
            txSuccess={txSuccess}
            setTxSuccess={setTxSuccess}
          />
        ))}
      </div>

      <Button
        size={'lg'}
        variant={'white'}
        fullWidth
        disabled={!txSuccess}
        onClick={async () => {
          closeModal(id);
          await onConfirm();
        }}
      >
        {buttonLabel}
      </Button>
    </Modal>
  );
};
