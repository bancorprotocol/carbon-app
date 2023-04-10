import { sendEvent } from '.';
import {
  CarbonEvents,
  ConfirmationType,
  EventCategory,
  StrategyType,
  TradeType,
} from './types';

export interface EventTokenConfirmationSchemaNew extends EventCategory {
  tokenConfirmationView: {
    input: TradeType | StrategyType;
    gtmData: TradeType | StrategyType;
  };
  tokenConfirmationUnlimitedSwitchChange: {
    input: TradeType | StrategyType | ConfirmationType;
    gtmData: TradeType | StrategyType | ConfirmationType;
  };
  tokenConfirmationUnlimitedApprove: {
    input: TradeType | StrategyType | ConfirmationType;
    gtmData: TradeType | StrategyType | ConfirmationType;
  };
}

export const tokenConfirmationEvents: CarbonEvents['tokenConfirmation'] = {
  tokenConfirmationView: (data) => {
    sendEvent('tokenConfirmation', 'tokenConfirmationView', data);
  },
  tokenConfirmationUnlimitedSwitchChange: (data) => {
    sendEvent(
      'tokenConfirmation',
      'tokenConfirmationUnlimitedSwitchChange',
      data
    );
  },
  tokenConfirmationUnlimitedApprove: (data) => {
    sendEvent('tokenConfirmation', 'tokenConfirmationUnlimitedApprove', data);
  },
};
