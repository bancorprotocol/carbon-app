import { sendEvent } from '.';
import {
  CarbonEvents,
  ConfirmationType,
  EventCategory,
  StrategyType,
  TradeType,
} from './types';

export interface EventTransactionConfirmationSchemaNew extends EventCategory {
  transactionConfirmationRequest: {
    input: (TradeType | StrategyType) & ConfirmationType;
    gtmData: (TradeType | StrategyType) & ConfirmationType;
  };
  transactionConfirm: {
    input: (TradeType | StrategyType) & ConfirmationType;
    gtmData: (TradeType | StrategyType) & ConfirmationType;
  };
}

export const transactionConfirmationEvents: CarbonEvents['transactionConfirmation'] =
  {
    transactionConfirmationRequest: (data) => {
      sendEvent(
        'transactionConfirmation',
        'transactionConfirmationRequest',
        data
      );
    },
    transactionConfirm: (data) => {
      sendEvent('transactionConfirmation', 'transactionConfirm', data);
    },
  };
