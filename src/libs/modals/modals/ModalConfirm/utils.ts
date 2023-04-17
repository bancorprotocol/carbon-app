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
        carbonEvents.transactionConfirmation.txConfirmationRequestStrategyCreate(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      case 'depositStrategyFunds':
        carbonEvents.transactionConfirmation.txConfirmationRequestDepositStrategyFunds(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      case 'trade':
        carbonEvents.transactionConfirmation.txConfirmationRequestTrade(
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
        carbonEvents.transactionConfirmation.txConfirmationStrategyCreate(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      case 'depositStrategyFunds':
        carbonEvents.transactionConfirmation.txConfirmationDepositStrategyFunds(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );
        break;
      case 'trade':
        carbonEvents.transactionConfirmation.txConfirmationTrade(
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
        carbonEvents.tokenApproval.tokenConfirmationViewStrategyCreate(
          eventData as StrategyEventType &
            TokenApprovalType &
            TransactionConfirmationType
        );

        break;
      case 'depositStrategyFunds':
        carbonEvents.tokenApproval.tokenConfirmationViewDepositStrategyFunds(
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
