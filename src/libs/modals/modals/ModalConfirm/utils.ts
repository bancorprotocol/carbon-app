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
  context?: 'editStrategy' | 'createStrategy' | 'trade'
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
      case 'editStrategy':
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
  context?: 'editStrategy' | 'createStrategy' | 'trade'
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
      case 'editStrategy':
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
  context?: 'editStrategy' | 'createStrategy' | 'trade'
) => {
  if (eventData) {
    switch (context) {
      case 'createStrategy':
        carbonEvents.tokenApproval.tokenConfirmationViewStrategyCreate(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );

        break;
      case 'editStrategy':
        carbonEvents.tokenApproval.tokenConfirmationViewStrategyEdit(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );

        break;
      case 'trade':
        carbonEvents.tokenApproval.tokenConfirmationViewTrade(
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
