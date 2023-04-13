import { sendGTMEvent } from './googleTagManager';
import {
  CarbonEvents,
  ConfirmationGTMEventType,
  EventCategory,
  StrategyGTMEventType,
  TradeGTMEventType,
} from './googleTagManager/types';
import { prepareConfirmationData } from './transactionConfirmationEvents';
import { ConfirmationEventType, StrategyEventOrTradeEvent } from './types';

export interface EventTokenConfirmationSchema extends EventCategory {
  tokenConfirmationView: {
    input: StrategyEventOrTradeEvent & ConfirmationEventType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedSwitchChange: {
    input: StrategyEventOrTradeEvent & ConfirmationEventType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedApprove: {
    input: StrategyEventOrTradeEvent & ConfirmationEventType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
}

export const tokenConfirmationEvents: CarbonEvents['tokenConfirmation'] = {
  tokenConfirmationView: (data) => {
    const tokenConfirmationData = prepareConfirmationData(data);
    sendGTMEvent(
      'tokenConfirmation',
      'tokenConfirmationView',
      tokenConfirmationData
    );
  },
  tokenConfirmationUnlimitedSwitchChange: (data) => {
    const tokenConfirmationData = prepareConfirmationData(data);
    sendGTMEvent(
      'tokenConfirmation',
      'tokenConfirmationUnlimitedSwitchChange',
      tokenConfirmationData
    );
  },
  tokenConfirmationUnlimitedApprove: (data) => {
    const tokenConfirmationData = prepareConfirmationData(data);
    sendGTMEvent(
      'tokenConfirmation',
      'tokenConfirmationUnlimitedApprove',
      tokenConfirmationData
    );
  },
};
