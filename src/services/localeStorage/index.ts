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

const APP_ID = 'carbon';
const APP_VERSION = 'v1';

// ************************** /
// BEWARE!! Keys are not to be removed or changed without setting a proper clean-up and migration logic in place!! Same for changing the app version!
// ************************** /

interface LocalStorageSchema {
  tenderlyRpc: string;
  imposterAccount: string;
  importedTokens: Token[];
  [k: `notifications-${string}`]: Notification[];
  [k: `favoriteTradePairs-${string}`]: TradePair[];
  [k: `favoriteTokens-${string}`]: Token[];
  tradePairsCategory: TradePairCategory;
  tradePair: [string, string];
  tradeSlippage: string;
  tradeDeadline: string;
  tradeMaxOrders: string;
  chooseTokenCategory: ChooseTokenCategory;
  carbonControllerAddress: string;
  strategyOverviewFilter: StrategyFilter;
  strategyOverviewSort: StrategySort;
  voucherContractAddress: string;
  tokenListCache: { tokens: Token[]; timestamp: number };
  sdkCompressedCacheData: string;
  tokenPairsCache: { pairs: TradePair[]; timestamp: number };
  isUncheckedSigner: boolean;
}

export const lsService = new ManagedLocalStorage<LocalStorageSchema>((key) =>
  [APP_ID, APP_VERSION, key].join('-')
);
