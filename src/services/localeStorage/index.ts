import { ConnectionType, EnumConnectionType } from 'libs/web3';
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
import { APP_ID, APP_VERSION } from 'utils/constants';
import { FiatSymbol } from 'utils/carbonApi';

// ************************** /
// BEWARE!! Keys are not to be removed or changed without setting a proper clean-up and migration logic in place!! Same for changing the app version!
// ************************** /

interface LocalStorageSchema {
  connectionType: ConnectionType | EnumConnectionType;
  tenderlyRpc: string;
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
}

export const lsService = new ManagedLocalStorage<LocalStorageSchema>((key) =>
  [APP_ID, APP_VERSION, key].join('-')
);
