import { EventGeneralSchema } from '../generalEvents';
import { EventNavigationSchema } from '../navigationEvents';
import { EventStrategyEditSchema } from '../strategyEditEvents';
import { EventStrategySchema } from '../strategyEvents';
import { EventTokenConfirmationSchema } from '../tokenConfirmationEvents';
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

export type TradeGTMEventType = {
  trade_direction?: string;
  token_pair?: string;
  buy_token?: string;
  sell_token?: string;
  value_usd?: string;
  blockchain_network?: string;
  transaction_hash?: string;
  message?: string;
  switch?: 'true' | 'false';
};

export type ConfirmationGTMEventType = {
  switch?: 'true' | 'false';
  token?: string | string[];
  product_type?: string;
};

export type StrategyGTMEventType = {
  strategy_id?: string;
  token_pair?: string;
  strategy_base_token?: string;
  strategy_quote_token?: string;
  strategy_buy_low_token?: string;
  strategy_buy_low_token_price?: string;
  strategy_buy_low_token_min_price?: string;
  strategy_buy_low_token_max_price?: string;
  strategy_buy_low_pay_token?: string;
  strategy_buy_low_order_type?: string;
  strategy_buy_low_budget?: string;
  strategy_buy_low_budget_usd?: string;
  strategy_sell_high_token?: string;
  strategy_sell_high_token_price?: string;
  strategy_sell_high_token_min_price?: string;
  strategy_sell_high_token_max_price?: string;
  strategy_sell_high_receive_token?: string;
  strategy_sell_high_order_type?: string;
  strategy_sell_high_budget?: string;
  strategy_sell_high_budget_usd?: string;
  strategy_type?: 'recurring' | 'disposable';
  strategy_direction?: 'buy' | 'sell';
  strategy_settings?: 'limit' | 'range' | 'custom' | undefined;
};

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
  tokenConfirmation: EventTokenConfirmationSchema;
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
