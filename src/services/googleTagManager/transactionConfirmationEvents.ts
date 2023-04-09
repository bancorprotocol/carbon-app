import { sendEvent } from '.';
import { CarbonEvents, EventCategory, StrategyType, TradeType } from './types';

export interface EventTransactionConfirmationSchemaNew extends EventCategory {
  transactionConfirmationRequest: {
    input: TradeType | StrategyType;
    gtmData: TradeType | StrategyType;
  };
  transactionConfirm: {
    input: TradeType | StrategyType;
    gtmData: TradeType | StrategyType;
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
