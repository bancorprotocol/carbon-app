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
} from 'utils/localStorageMigration';

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
// ************************** /

/**
 * An array of migration objects, each designed to handle specific versions of stored items.
 * @type {Migration[]}
 * @property {Function} matcher - A function that takes a formattedKey and returns the key found or undefined if not found.
 * @property {Function} action - The action to take for each key found with the matcher function, receives oldFormattedKey, key = matcher(oldFormattedKey) and the newFormattedKey.
 */
const migrations: Migration[] = [
  {
    matcher: (formattedKey) => {
      const prefix = 'carbon-v1.1-';
      const isMatch = formattedKey.startsWith(prefix);
      if (isMatch) return formattedKey.slice(prefix.length);
    },
    action: migrateAndRemoveItem,
  },
  {
    matcher: (formattedKey) => {
      const prefix = 'carbon-v1-';
      const isMatch = formattedKey.startsWith(prefix);
      if (isMatch) return formattedKey.slice(prefix.length);
    },
    action: removeItem,
  },
];

export const lsService = new ManagedLocalStorage<LocalStorageSchema>(
  (key) => [APP_ID, NETWORK, APP_VERSION, key].join('-'),
  migrations
);
