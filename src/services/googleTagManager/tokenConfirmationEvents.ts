import { sendGTMEvent } from '.';
import {
  CarbonEvents,
  ConfirmationGTMEventType,
  EventCategory,
  StrategyGTMEventType,
  TradeGTMEventType,
} from './types';

export interface EventTokenConfirmationSchemaNew extends EventCategory {
  tokenConfirmationView: {
    input: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedSwitchChange: {
    input: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
  tokenConfirmationUnlimitedApprove: {
    input: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
    gtmData: (TradeGTMEventType | StrategyGTMEventType) &
      ConfirmationGTMEventType;
  };
}

export const tokenConfirmationEvents: CarbonEvents['tokenConfirmation'] = {
  tokenConfirmationView: (data) => {
    sendGTMEvent('tokenConfirmation', 'tokenConfirmationView', data);
  },
  tokenConfirmationUnlimitedSwitchChange: (data) => {
    sendGTMEvent(
      'tokenConfirmation',
      'tokenConfirmationUnlimitedSwitchChange',
      data
    );
  },
  tokenConfirmationUnlimitedApprove: (data) => {
    sendGTMEvent(
      'tokenConfirmation',
      'tokenConfirmationUnlimitedApprove',
      data
    );
  },
};
