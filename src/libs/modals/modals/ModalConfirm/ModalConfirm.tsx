import { ModalProps } from 'libs/modals/modals.types';
import { ApproveToken } from 'components/common/approval';
import { useModal } from 'hooks/useModal';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { Modal, ModalHeader } from 'libs/modals/Modal';

interface ModalCreateConfirmData {
  approvalTokens: ApprovalToken[];
  onConfirm: () => any;
  buttonLabel?: string;
}

export default function ModalConfirm({
  id,
  data: { approvalTokens, onConfirm, buttonLabel = 'Confirm' },
}: ModalProps<ModalCreateConfirmData>) {
  const { closeModal } = useModal();
  const { approvalQuery, approvalRequired } = useApproval(approvalTokens);

  return (
    <Modal id={id} data-testid="approval-modal" className="grid gap-16">
      <ModalHeader id={id}>
        <h2>Confirm Transaction</h2>
      </ModalHeader>
      <h3 className="text-14 text-main-0/60">Approve Tokens</h3>
      <ul className="grid gap-8">
        {approvalQuery.map(({ data, isPending, error }, i) => (
          <li key={i}>
            <ApproveToken data={data} isPending={isPending} error={error} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={approvalRequired}
        onClick={async () => {
          closeModal(id);
          await onConfirm();
        }}
        className="btn-main-gradient shrink-0 text-16"
        data-testid="approve-submit"
      >
        {buttonLabel}
      </button>
    </Modal>
  );
}
