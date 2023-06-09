import { useEffect } from 'react';
import {
  TokenApprovalType,
  TransactionConfirmationType,
  StrategyEventType,
  TradeEventType,
} from 'services/events/types';
import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { i18n } from 'libs/translations';
import { useModal } from 'hooks/useModal';
import { ApprovalToken, useApproval } from 'hooks/useApproval';
import { ApproveToken } from 'components/common/approval';
import { Button } from 'components/common/button';
import {
  handleConfirmationPopupViewEvent,
  handleAfterConfirmationEvent,
  handleOnRequestEvent,
} from './utils';

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
    buttonLabel = i18n.t('modals.confirm.actionButtons.actionButton1'),
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
    <Modal id={id} title={i18n.t('modals.confirm.modalTitle')} size={'md'}>
      <h3 className="text-secondary my-10">
        {i18n.t('modals.confirm.subtitle')}
      </h3>
      <div className="mb-20 space-y-20">
        {approvalQuery.map(({ data, isLoading, error }, i) => (
          <ApproveToken
            key={i}
            data={data}
            isLoading={isLoading}
            error={error}
            eventData={eventData}
            context={context}
          />
        ))}
      </div>
      <Button
        size="lg"
        variant={'white'}
        fullWidth
        disabled={approvalRequired}
        onClick={async () => {
          handleOnRequestEvent(eventData, context);
          closeModal(id);
          await onConfirm();
          handleAfterConfirmationEvent(eventData, context);
        }}
      >
        {buttonLabel}
      </Button>
    </Modal>
  );
};
