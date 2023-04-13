import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { ApproveToken } from 'components/common/approval';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { carbonEvents } from 'services/events';

import { useEffect } from 'react';
import {
  ConfirmationGTMEventType,
  StrategyGTMEventType,
  TradeGTMEventType,
} from 'services/events/googleTagManager/types';

export type ModalCreateConfirmData = {
  approvalTokens: ApprovalToken[];
  onConfirm: Function;
  buttonLabel?: string;
  eventData?: (TradeGTMEventType | StrategyGTMEventType) &
    ConfirmationGTMEventType;
};

export const ModalConfirm: ModalFC<ModalCreateConfirmData> = ({
  id,
  data: { approvalTokens, onConfirm, buttonLabel = 'Confirm', eventData },
}) => {
  const { closeModal } = useModal();
  const { approvalQuery, approvalRequired } = useApproval(approvalTokens);

  useEffect(() => {
    eventData &&
      carbonEvents.tokenConfirmation.tokenConfirmationView(eventData);
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
            eventData={eventData}
          />
        ))}
      </div>
      <Button
        size="lg"
        variant="white"
        fullWidth
        disabled={approvalRequired}
        onClick={async () => {
          eventData &&
            carbonEvents.transactionConfirmation.transactionConfirmationRequest(
              eventData
            );
          closeModal(id);
          await onConfirm();
          eventData &&
            carbonEvents.transactionConfirmation.transactionConfirm(eventData);
        }}
      >
        {buttonLabel}
      </Button>
    </Modal>
  );
};
