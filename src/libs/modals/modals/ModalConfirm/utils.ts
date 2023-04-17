import { carbonEvents } from 'services/events';
import {
  StrategyEventType,
  TokenApprovalType,
  TradeEventType,
  TransactionConfirmationType,
} from 'services/events/types';

export const handleOnRequestEvent = (
  eventData?: (StrategyEventType | TradeEventType) &
    TokenApprovalType &
    TransactionConfirmationType,
  context?: 'depositStrategyFunds' | 'createStrategy' | 'trade'
) => {
  if (eventData) {
    switch (context) {
      case 'createStrategy':
        carbonEvents.transactionConfirmation.txStrategyCreateConfirmationRequest(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      case 'depositStrategyFunds':
        carbonEvents.transactionConfirmation.txStrategyEditConfirmationRequest(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      case 'trade':
        carbonEvents.transactionConfirmation.txTradeConfirmationRequest(
          eventData as TradeEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      default:
        break;
    }
  }
};

export const handleAfterConfirmationEvent = (
  eventData?: (StrategyEventType | TradeEventType) &
    TokenApprovalType &
    TransactionConfirmationType,
  context?: 'depositStrategyFunds' | 'createStrategy' | 'trade'
) => {
  if (eventData) {
    switch (context) {
      case 'createStrategy':
        carbonEvents.transactionConfirmation.txStrategyCreateConfirm(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      case 'depositStrategyFunds':
        carbonEvents.transactionConfirmation.txStrategyEditConfirm(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      case 'trade':
        carbonEvents.transactionConfirmation.txTradeConfirm(
          eventData as TradeEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      default:
        break;
    }
  }
};

export const handleConfirmationPopupViewEvent = (
  eventData?: (StrategyEventType | TradeEventType) &
    TokenApprovalType &
    TransactionConfirmationType,
  context?: 'depositStrategyFunds' | 'createStrategy' | 'trade'
) => {
  if (eventData) {
    switch (context) {
      case 'createStrategy':
        carbonEvents.tokenApproval.tokenConfirmationView_StrategyCreate(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );

        break;
      case 'depositStrategyFunds':
        carbonEvents.tokenApproval.tokenConfirmationView_DepositStrategyFunds(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );

        break;
      case 'trade':
        carbonEvents.tokenApproval.tokenConfirmationView_Trade(
          eventData as TradeEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );

        break;
      default:
        break;
    }
  }
};
