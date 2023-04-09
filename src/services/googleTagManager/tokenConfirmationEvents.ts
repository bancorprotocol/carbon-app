import { sendEvent } from '.';
import { CarbonEvents, EventCategory, StrategyType, TradeType } from './types';

export interface EventTokenConfirmationSchemaNew extends EventCategory {
  tokenConfirmationView: {
    input: TradeType | StrategyType;
    gtmData: TradeType | StrategyType;
  };
  tokenConfirmationUnlimitedSwitchChange: {
    input: TradeType | StrategyType;
    gtmData: TradeType | StrategyType;
  };
  tokenConfirmationUnlimitedApprove: {
    input:
      | TradeType
      | StrategyType
      | { token: string; switch: 'true' | 'false' };
    gtmData:
      | TradeType
      | StrategyType
      | { token: string; switch: 'true' | 'false' };
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
