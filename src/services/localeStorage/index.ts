import { ManagedLocalStorage } from 'utils/managedLocalStorage';
import { Token } from 'libs/tokens';
import { Notification } from 'libs/notifications';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { TradePairCategory } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenListContent';
import { ChooseTokenCategory } from 'libs/modals/modals/ModalTokenList/ModalTokenListContent';
import {
  EnumStrategyFilter,
  EnumStrategySort,
  StrategyFilter,
  StrategySort,
} from 'components/strategies/overview/StrategyFilterSort';
import { APP_ID, APP_VERSION, NETWORK } from 'utils/constants';
import { FiatSymbol } from 'utils/carbonApi';
import {
  Migration,
  migrateAndRemoveItem,
  removeItem,
} from 'utils/migrateLocalStorage';
import { NotificationPreference } from 'libs/notifications/NotificationPreferences';

// ************************** /
// BEWARE!! Keys are not to be removed or changed without setting a proper clean-up and migration logic in place!! Same for changing the app version!
// ************************** /

interface LocalStorageSchema {
  tenderlyRpc: string;
  carbonApi: string;
  imposterAccount: string;
  importedTokens: Token[];
  [k: `notifications-${string}`]: Notification[];
  [k: `favoriteTradePairs-${string}`]: TradePair[];
  [k: `favoriteTokens-${string}`]: Token[];
  tradePairsCategory: TradePairCategory;
  tradePair: [string, string];
  currentCurrency: FiatSymbol;
  tradeSlippage: string;
  tradeDeadline: string;
  tradeMaxOrders: string;
  chooseTokenCategory: ChooseTokenCategory;
  carbonControllerAddress: string;
  strategyOverviewFilter: StrategyFilter | EnumStrategyFilter;
  strategyOverviewSort: StrategySort | EnumStrategySort;
  voucherContractAddress: string;
  tokenListCache: { tokens: Token[]; timestamp: number };
  sdkCompressedCacheData: string;
  tokenPairsCache: { pairs: TradePair[]; timestamp: number };
  isUncheckedSigner: boolean;
  hasSeenRestrictedCountryModal: boolean;
  hasSeenCreateStratExpertMode: boolean;
  simDisclaimerLastSeen: number;
  lastSdkCache: { timestamp: number; ttl: number };
  notificationPreferences: NotificationPreference;
}

// ************************** /
// LOCAL STORAGE MIGRATION AND CLEAN_UP
// Order matters! The migrations are performed in top to bottom order. In most cases, new migrations should be added to the bottom of the list
// ************************** /

/**
 * An array of migration objects, each designed to handle specific versions of stored items.
 * @type {Migration[]}
 * @property {Function} migrate - A function that takes the prevFormattedKey of each localStorage object key to be migrated and performs any migration operations.
 */
const migrations: Migration[] = [
  {
    migrate: (prevFormattedKey) => {
      const prefix = 'carbon-v1-';
      const isMatch = prevFormattedKey.startsWith(prefix);
      if (!isMatch) return;
      removeItem({ prevFormattedKey });
    },
  },
  {
    migrate: (prevFormattedKey) => {
      const prefix = 'carbon-v1-1-';
      const isMatch = prevFormattedKey.startsWith(prefix);
      if (!isMatch) return;
      const key = prevFormattedKey.slice(prefix.length);
      if (!key) return;
      const nextFormattedKey = ['carbon-v1.1', NETWORK, key].join('-');
      migrateAndRemoveItem({ prevFormattedKey, nextFormattedKey });
    },
  },
];

export const lsService = new ManagedLocalStorage<LocalStorageSchema>(
  (key) => [APP_ID, NETWORK, APP_VERSION, key].join('-'),
  migrations
);
