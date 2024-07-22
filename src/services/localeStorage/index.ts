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
  MigratorLocalStorage,
  migrateAndRemoveItem,
  removeItem,
} from 'utils/migratorLocalStorage';

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
}

// ************************** /
// LOCAL STORAGE MIGRATION AND CLEAN_UP
// Order matters! The migrations are performed in top to bottom order. In most cases, new migrations should be added to the bottom of the list
// ************************** /

/**
 * An array of migration objects, each designed to handle specific versions of stored items.
 * @type {Migration[]}
 * @property {Function} oldKeyExtractor - A function that takes the formattedKey of the object to be migrated and returns the key found or undefined if not found.
 * @property {Function} newKeyFormatter - A function that takes the key of the object and returns the new formatted key that it should be migrated to.
 * @property {Function} action - The action to take for each key found with the oldKeyExtractor function, receives `oldFormattedKey`, `key = oldKeyExtractor(oldFormattedKey)` and the `newFormattedKey = newKeyFormatter(key)`.
 */
const migrations: Migration[] = [
  {
    oldKeyExtractor: (oldFormattedKey) => {
      const prefix = 'carbon-v1-';
      const isMatch = oldFormattedKey.startsWith(prefix);
      if (isMatch) return oldFormattedKey.slice(prefix.length);
    },
    action: removeItem,
  },
  {
    oldKeyExtractor: (oldFormattedKey) => {
      const prefix = 'carbon-v1.1-';
      const isMatch = oldFormattedKey.startsWith(prefix);
      if (isMatch) return oldFormattedKey.slice(prefix.length);
    },
    newKeyFormatter: (key: string) =>
      ['carbon', NETWORK, 'v1.1', key].join('-'),
    action: migrateAndRemoveItem,
  },
];

const migrator = new MigratorLocalStorage(migrations);

export const lsService = new ManagedLocalStorage<LocalStorageSchema>(
  (key) => [APP_ID, NETWORK, APP_VERSION, key].join('-'),
  migrator
);
