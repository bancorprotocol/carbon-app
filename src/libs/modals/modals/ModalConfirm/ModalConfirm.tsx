import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal } from 'libs/modals/Modal';
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
import { TxStatus } from 'components/strategies/create/types';

export type ModalCreateConfirmData = {
  approvalTokens: ApprovalToken[];
  onConfirm: Function;
  onClose?: Function;
  context?: 'depositStrategyFunds' | 'createStrategy' | 'trade';
  buttonLabel?: string;
  eventData?: (StrategyEventType | TradeEventType) &
    TokenApprovalType &
    TransactionConfirmationType;
  txStatus?: TxStatus;
  setTxStatus?: Dispatch<SetStateAction<TxStatus>>;
};

export const ModalConfirm: ModalFC<ModalCreateConfirmData> = ({
  id,
  data: {
    approvalTokens,
    onConfirm,
    onClose,
    buttonLabel = 'Confirm',
    eventData,
    context,
  },
}) => {
  const { closeModal } = useModal();
  const { approvalQuery, approvalRequired } = useApproval(approvalTokens);
  const [txStatus, setTxStatus] = useState<TxStatus>('initial');
  const isCtaDisabled =
    txStatus === 'processing' || txStatus === 'waitingForConfirmation';

  useEffect(() => {
    handleConfirmationPopupViewEvent(eventData, context);
  }, [context, eventData]);

  return (
    <Modal
      onClose={() => onClose && onClose()}
      id={id}
      title="Confirm Transaction"
      size={'md'}
    >
      <h3 className="text-secondary my-10">Approve Tokens</h3>
      <div className="mb-20 space-y-20">
        {approvalQuery.map(({ data, isLoading, error }, i) => (
          <ApproveToken
            key={i}
            data={data}
            isLoading={isLoading}
            error={error}
            eventData={eventData}
            context={context}
            setTxStatus={setTxStatus}
          />
        ))}
      </div>
      <Button
        size="lg"
        variant={isCtaDisabled ? 'black' : 'white'}
        fullWidth
        loading={isCtaDisabled}
        disabled={approvalRequired || isCtaDisabled}
        onClick={async () => {
          handleOnRequestEvent(eventData, context);
          closeModal(id);
          await onConfirm();
          handleAfterConfirmationEvent(eventData, context);
        }}
      >
        {txStatus === 'processing'
          ? 'Processing'
          : txStatus === 'waitingForConfirmation'
          ? 'Waiting For Confirmation'
          : buttonLabel}
      </Button>
    </Modal>
  );
};
