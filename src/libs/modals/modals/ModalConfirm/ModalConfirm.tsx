import { useEffect } from 'react';
import { ModalFC } from 'libs/modals/modals.types';
import { ApproveToken } from 'components/common/approval';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import {
  TokenApprovalType,
  TransactionConfirmationType,
  StrategyEventType,
  TradeEventType,
} from 'services/events/types';
import {
  handleConfirmationPopupViewEvent,
  handleAfterConfirmationEvent,
  handleOnRequestEvent,
} from './utils';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export type ModalCreateConfirmData = {
  approvalTokens: ApprovalToken[];
  onConfirm: Function;
  context?: 'depositStrategyFunds' | 'createStrategy' | 'trade';
  buttonLabel?: string;
  eventData?: (StrategyEventType | TradeEventType) &
    TokenApprovalType &
    TransactionConfirmationType;
};

export const ModalConfirm: ModalFC<ModalCreateConfirmData> = ({
  id,
  data: {
    approvalTokens,
    onConfirm,
    buttonLabel = 'Confirm',
    eventData,
    context,
  },
}) => {
  const { closeModal } = useModal();
  const { approvalQuery, approvalRequired } = useApproval(approvalTokens);

  useEffect(() => {
    handleConfirmationPopupViewEvent(eventData, context);
  }, [context, eventData]);

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
            <ApproveToken
              data={data}
              isPending={isPending}
              error={error}
              eventData={eventData}
              context={context}
            />
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
          handleOnRequestEvent(eventData, context);
          closeModal(id);
          await onConfirm();
          handleAfterConfirmationEvent(eventData, context);
        }}
        className="shrink-0"
        data-testid="approve-submit"
      >
        {buttonLabel}
      </Button>
    </ModalOrMobileSheet>
  );
};
