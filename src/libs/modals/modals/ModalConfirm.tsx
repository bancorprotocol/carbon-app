import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { ApproveToken } from 'components/common/approval';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { sendEvent, StrategyType, TradeType } from 'services/googleTagManager';
import { useEffect } from 'react';

export type ModalCreateConfirmData = {
  approvalTokens: ApprovalToken[];
  onConfirm: Function;
  buttonLabel?: string;
  eventData?: TradeType | StrategyType;
};

export const ModalConfirm: ModalFC<ModalCreateConfirmData> = ({
  id,
  data: { approvalTokens, onConfirm, buttonLabel = 'Confirm', eventData },
}) => {
  const { closeModal } = useModal();
  const { approvalQuery, approvalRequired } = useApproval(approvalTokens);

  useEffect(() => {
    eventData &&
      sendEvent('confirmation', 'token_confirmation_view', eventData);
  }, [eventData]);

  return (
    <Modal id={id} title="Confirm Transaction">
      <h3 className="text-secondary my-10">Approve Tokens</h3>
      <div className="mb-20 space-y-20">
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
        size="lg"
        variant="white"
        fullWidth
        disabled={approvalRequired}
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
