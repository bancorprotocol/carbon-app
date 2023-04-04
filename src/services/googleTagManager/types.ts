import { EventGeneralSchemaNew } from './generalEvents';
import { EventNavigationSchemaNew } from './navigationEvents';
import { EventStrategySchemaNew } from './strategyEvents';
import { EventWalletSchemaNew } from './walletEvents';

export type GTMData = {
  event?: string;
  event_properties?: any;
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

export type TradeType = {
  trade_direction?: string;
  token_pair: string;
  buy_token: string;
  sell_token: string;
  value_usd?: string;
  blockchain_network?: string;
  transaction_hash?: string;
  message?: string;
  switch?: boolean;
};

export type ConfirmationType = {
  switch?: boolean;
  token?: string;
};

export type StrategyType = {
  strategy_id?: string;
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
};

export type EventCategory = { [key: string]: { input: any; gtmData: any } };

export type CarbonEventsBase = {
  [key: string]: EventCategory;
};

interface CarbonEventSchema extends CarbonEventsBase {
  general: EventGeneralSchemaNew;
  wallet: EventWalletSchemaNew;
  navigation: EventNavigationSchemaNew;
  strategy: EventStrategySchemaNew;
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
