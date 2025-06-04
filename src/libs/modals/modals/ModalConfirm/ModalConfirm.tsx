import { ModalFC } from 'libs/modals/modals.types';
import { ApproveToken } from 'components/common/approval';
import { Button } from 'components/common/button';
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
      size="md"
      data-testid="approval-modal"
    >
      <h3 className="text-14 my-10 text-white/60">Approve Tokens</h3>
      <ul className="grid gap-20">
        {approvalQuery.map(({ data, isPending, error }, i) => (
          <li key={i}>
            <ApproveToken data={data} isPending={isPending} error={error} />
          </li>
        ))}
      </ul>
      <Button
        type="button"
        size="lg"
        variant="success"
        fullWidth
        disabled={approvalRequired}
        onClick={async () => {
          closeModal(id);
          await onConfirm();
        }}
        className="shrink-0"
        data-testid="approve-submit"
      >
        {buttonLabel}
      </Button>
    </ModalOrMobileSheet>
  );
};
