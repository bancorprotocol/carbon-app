import { sendGTMEvent } from '.';
import {
  CarbonEvents,
  ConfirmationGTMEventType,
  EventCategory,
  StrategyGTMEventType,
  TradeGTMEventType,
} from './types';

export interface EventTransactionConfirmationSchemaNew extends EventCategory {
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
