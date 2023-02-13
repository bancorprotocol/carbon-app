import { ManagedLocalStorage } from 'utils/managedLocalStorage';
import { ConnectionType } from 'libs/web3';
import { Token } from 'libs/tokens';
import { Notification } from 'libs/notifications';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { TradePairCategory } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenListContent';

const APP_ID = 'bancor';
const APP_VERSION = 'v0';

// ************************** /
// BEWARE!! Keys are not to be removed or changed without setting a proper clean-up and migration logic in place!! Same for changing the app version!
// ************************** /

interface LocalStorageSchema {
  tenderlyRpc: string;
  imposterAccount: string;
  connectionType: ConnectionType;
  importedTokens: Token[];
  // TODO check for autocomplete possibility
  [k: `notifications-${string}`]: Notification[];
  [k: `favoriteTradePairs-${string}`]: TradePair[];
  tradePairsCategory: TradePairCategory;
  tradeSlippage: string;
  tradeDeadline: string;
  tradeMaxOrders: string;
}

export const lsService = new ManagedLocalStorage<LocalStorageSchema>((key) =>
  [APP_ID, APP_VERSION, key].join('-')
);
