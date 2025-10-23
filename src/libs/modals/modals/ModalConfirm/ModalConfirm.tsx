import { ModalFC } from 'libs/modals/modals.types';
import { ApproveToken } from 'components/common/approval';
import { useModal } from 'hooks/useModal';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export type ModalCreateConfirmData = {
  approvalTokens: ApprovalToken[];
  onConfirm: () => any;
  buttonLabel?: string;
};

export const ModalConfirm: ModalFC<ModalCreateConfirmData> = ({
  id,
  data: { approvalTokens, onConfirm, buttonLabel = 'Confirm' },
}) => {
  const { closeModal } = useModal();
  const { approvalQuery, approvalRequired } = useApproval(approvalTokens);

  return (
    <ModalOrMobileSheet
      id={id}
      title="Confirm Transaction"
      data-testid="approval-modal"
      className="md:min-w-300"
    >
      <h3 className="text-14 my-10 text-white/60">Approve Tokens</h3>
      <ul className="grid gap-20">
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
        className="btn-primary-gradient shrink-0 text-16"
        data-testid="approve-submit"
      >
        {buttonLabel}
      </button>
    </ModalOrMobileSheet>
  );
};
