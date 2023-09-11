import { explorerEvents } from './explorerEvents';
import { generalEvents } from './generalEvents';
import { CarbonEvents } from './googleTagManager/types';
import { navigationEvents } from './navigationEvents';
import { strategyEditEvents } from './strategyEditEvents';
import { strategyEvents } from './strategyEvents';
import { tokenApprovalEvents } from './tokenApprovalEvents';
import { tradeEvents } from './tradeEvents';
import { transactionConfirmationEvents } from './transactionConfirmationEvents';
import { walletEvents } from './walletEvents';

export const carbonEvents: CarbonEvents = {
  general: generalEvents,
  wallet: walletEvents,
  navigation: navigationEvents,
  strategy: strategyEvents,
  strategyEdit: strategyEditEvents,
  trade: tradeEvents,
  transactionConfirmation: transactionConfirmationEvents,
  tokenApproval: tokenApprovalEvents,
  explorer: explorerEvents,
};
