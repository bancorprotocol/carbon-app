import { StrategySettings } from 'libs/routing';
import { EventExplorerSchema } from '../explorerEvents';
import { EventGeneralSchema } from '../generalEvents';
import { EventNavigationSchema } from '../navigationEvents';
import { EventStrategyEditSchema } from '../strategyEditEvents';
import { EventStrategySchema } from '../strategyEvents';
import { EventTokenApprovalSchema } from '../tokenApprovalEvents';
import { EventTradeSchema } from '../tradeEvents';
import { EventTransactionConfirmationSchema } from '../transactionConfirmationEvents';
import { EventWalletSchema } from '../walletEvents';

export type GTMData = {
  event?: string;
  event_properties?: any;
  user_properties?: { wallet_id: string; wallet_name: string } | {};
  wallet?: { wallet_id: string; wallet_name: string } | {};
  page?:
    | {
        page_referrer_spa: string;
      }
    | {};
};

export type Message = {
  section?: string;
  message: string;
};

export type TradeGTMEventTypeBase = {
  token_pair: string;
  buy_token: string;
  sell_token: string;
};

export interface TradeGTMEventType extends TradeGTMEventTypeBase {
  trade_direction?: string;
  value_usd?: string;
  message?: string;
}

export type TransactionConfirmationGTMType = {
  blockchain_network: string;
  transaction_hash?: string;
};

export type ConfirmationGTMEventType = {
  switch?: string;
  token?: string | string[];
  product_type?: string;
  context: 'strategy_create' | 'strategy_deposit' | 'trade';
};

export interface StrategyGTMEventTypeBase {
  token_pair: string;
  strategy_base_token: string;
  strategy_quote_token: string;
  strategy_type?: 'recurring' | 'disposable' | 'overlapping';
  strategy_direction?: 'buy' | 'sell';
  strategy_settings?: StrategySettings;
}

export interface StrategyBuyGTMEventType {
  strategy_buy_low_token_price: string;
  strategy_buy_low_token_min_price: string;
  strategy_buy_low_token_max_price: string;
  strategy_buy_low_order_type: string;
  strategy_buy_low_budget: string;
  strategy_buy_low_budget_usd: string;
}

export interface StrategySellGTMEventType {
  strategy_sell_high_token_price: string;
  strategy_sell_high_token_min_price: string;
  strategy_sell_high_token_max_price: string;
  strategy_sell_high_order_type: string;
  strategy_sell_high_budget: string;
  strategy_sell_high_budget_usd: string;
}

export interface StrategyGTMEventType
  extends StrategyGTMEventTypeBase,
    StrategyBuyGTMEventType,
    StrategySellGTMEventType {}

export interface StrategyEditGTMEventType
  extends StrategyGTMEventTypeBase,
    StrategyBuyGTMEventType,
    StrategySellGTMEventType {
  strategy_id: string;
}

export type EventCategory = { [key: string]: { input: any; gtmData: any } };

export type CarbonEventsBase = {
  [key: string]: EventCategory;
};

interface CarbonEventSchema extends CarbonEventsBase {
  general: EventGeneralSchema;
  wallet: EventWalletSchema;
  navigation: EventNavigationSchema;
  strategy: EventStrategySchema;
  strategyEdit: EventStrategyEditSchema;
  trade: EventTradeSchema;
  transactionConfirmation: EventTransactionConfirmationSchema;
  tokenApproval: EventTokenApprovalSchema;
  explorer: EventExplorerSchema;
}

export type SendEventFn = <
  T extends Extract<keyof CarbonEventSchema, string>,
  D extends Extract<keyof CarbonEventSchema[T], string>
>(
  type: T,
  event: D,
  data: CarbonEventSchema[T][D]['gtmData']
) => void;

export type CarbonEvents = {
  [key in keyof CarbonEventSchema]: {
    [key2 in keyof CarbonEventSchema[key]]: (
      input: CarbonEventSchema[key][key2]['input']
    ) => void;
  };
};
