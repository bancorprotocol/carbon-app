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
    input: TradeType | StrategyType | { token: string };
    gtmData: TradeType | StrategyType | { token: string };
  };
  tokenConfirm: {
    input: TradeType | StrategyType | { token: string };
    gtmData: TradeType | StrategyType | { token: string };
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
  tokenConfirm: (data) => {
    sendEvent('tokenConfirmation', 'tokenConfirm', data);
  },
};
