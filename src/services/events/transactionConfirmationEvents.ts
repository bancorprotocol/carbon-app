import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  ConfirmationGTMEventType,
  EventCategory,
  StrategyGTMEventType,
  TradeGTMEventType,
} from './googleTagManager/types';

export interface EventTransactionConfirmationSchema extends EventCategory {
  transactionConfirmationRequest: {
    input: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
  transactionConfirm: {
    input: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
}

export const transactionConfirmationEvents: CarbonEvents['transactionConfirmation'] =
  {
    transactionConfirmationRequest: (data) => {
      sendGTMEvent(
        'transactionConfirmation',
        'transactionConfirmationRequest',
        data
      );
    },
    transactionConfirm: (data) => {
      sendGTMEvent('transactionConfirmation', 'transactionConfirm', data);
    },
  };
