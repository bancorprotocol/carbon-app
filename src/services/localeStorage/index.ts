import { ManagedLocalStorage } from 'utils/managedLocalStorage';
import { Token } from 'libs/tokens';
import { Notification } from 'libs/notifications';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { TradePairCategory } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenListContent';
import { ChooseTokenCategory } from 'libs/modals/modals/ModalTokenList/ModalTokenListContent';
import {
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
import { AppConfig } from 'config/types';
import { StrategyLayout } from 'components/strategies/StrategySelectLayout';
import { Cart } from 'components/cart/utils';

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
  strategyOverviewFilter: StrategyFilter;
  strategyOverviewSort: StrategySort;
  voucherContractAddress: string;
  batcherContractAddress: string;
  tokenListCache: { tokens: Token[]; timestamp: number };
  sdkCompressedCacheData: string;
  tokenPairsCache: { pairs: TradePair[]; timestamp: number };
  isUncheckedSigner: boolean;
  hasSeenRestrictedCountryModal: boolean;
  hasSeenCreateStratExpertMode: boolean;
  simDisclaimerLastSeen: number;
  lastSdkCache: { timestamp: number; ttl: number };
  notificationPreferences: NotificationPreference;
  configOverride: Partial<AppConfig>;
  featureFlags: string[];
  strategyLayout: StrategyLayout;
  carts: Record<string, Cart>;
}

enum EnumStrategySort {
  Recent,
  Old,
  PairAscending,
  PairDescending,
  RoiAscending,
  RoiDescending,
}
enum EnumStrategyFilter {
  All,
  Active,
  Inactive,
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
      const prefix = 'carbon-v1.1-';
      const isMatch = prevFormattedKey.startsWith(prefix);
      if (!isMatch) return;
      const key = prevFormattedKey.slice(prefix.length);
      if (!key) return;
      const nextFormattedKey = ['carbon', NETWORK, 'v1.1', key].join('-');
      migrateAndRemoveItem({ prevFormattedKey, nextFormattedKey });
    },
  },
  {
    migrate: (prevFormattedKey) => {
      const prefix = `carbon-${NETWORK}-v1.1-`;
      if (prevFormattedKey === `${prefix}strategyOverviewSort`) {
        const current = lsService.getItem('strategyOverviewSort') as any;
        if (current in EnumStrategySort) removeItem({ prevFormattedKey });
        if (['roiAsc', 'roiDesc'].includes(current))
          removeItem({ prevFormattedKey });
      }
      if (prevFormattedKey === `${prefix}strategyOverviewFilter`) {
        const current = lsService.getItem('strategyOverviewFilter') as any;
        if (current in EnumStrategyFilter) removeItem({ prevFormattedKey });
      }
      const isMatch = prevFormattedKey.startsWith(prefix);
      if (!isMatch) return;
      const key = prevFormattedKey.slice(prefix.length);
      if (!key) return;
      const nextFormattedKey = ['carbon', NETWORK, 'v1.2', key].join('-');
      migrateAndRemoveItem({ prevFormattedKey, nextFormattedKey });
    },
  },
  {
    migrate: (prevFormattedKey) => {
      const prefix = `carbon-${NETWORK}-v1.2-`;
      if (prevFormattedKey === `${prefix}currentCurrency`) {
        if (NETWORK !== 'ethereum') removeItem({ prevFormattedKey });
      }
      const isMatch = prevFormattedKey.startsWith(prefix);
      if (!isMatch) return;
      const key = prevFormattedKey.slice(prefix.length);
      if (!key) return;
      const nextFormattedKey = ['carbon', NETWORK, 'v1.3', key].join('-');
      migrateAndRemoveItem({ prevFormattedKey, nextFormattedKey });
    },
  },
];

export const lsService = new ManagedLocalStorage<LocalStorageSchema>(
  (key) => [APP_ID, NETWORK, APP_VERSION, key].join('-'),
  migrations,
);
