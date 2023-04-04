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

type EventGeneralSchema = {
  change_page: {
    page_referrer_spa: string | null;
  };
};

type EventTokenConfirmationSchema = {
  token_confirmation_view: (StrategyType | TradeType) & ConfirmationType;
  token_confirmation_unlimited_switch_change: (StrategyType | TradeType) &
    ConfirmationType;
  token_confirmation_unlimited_approve: (StrategyType | TradeType) &
    ConfirmationType;
  token_confirm: (StrategyType | TradeType) & ConfirmationType;
};

type EventTransactionConfirmationSchema = {
  transaction_confirmation_request: TradeType | StrategyType;
  transaction_confirm: TradeType | StrategyType;
};

type EventStrategySchema = {
  new_strategy_create_click: undefined;
  new_strategy_base_token_select: { token: string };
  new_strategy_quote_token_select: { token: string };
  strategy_base_token_change: { token: string };
  strategy_quote_token_change: { token: string };
  strategy_token_swap: { tokenPair: string; tokenPairFrom: string };
  strategy_chart_open: undefined;
  strategy_chart_close: undefined;
  strategy_buy_low_order_type_change: StrategyType;
  strategy_buy_low_price_set: StrategyType;
  strategy_buy_low_budget_set: StrategyType;
  strategy_sell_high_order_type_change: StrategyType;
  strategy_sell_high_price_set: StrategyType;
  strategy_sell_high_budget_set: StrategyType;
  strategy_create_click: StrategyType;
  strategy_create: StrategyType;
  strategy_warning_show: Message;
  strategy_error_show: Message;
  strategy_tooltip_show: Message;
};

type Message = {
  section?: string;
  message: string;
};

type EventTradeSchema = {
  trade_warning_show: Message;
  trade_error_show: TradeType;
  trade_pair_swap: TradeType;
  trade_pair_change_click: TradeType;
  trade_pair_change: TradeType;
  trade_pair_settings_click: TradeType;
  trade_pair_settings_set: TradeType;
  trade_slippage_tolerance_change: {
    trade_slippage_tolerance: string;
  };
  trade_transaction_expiration_time_change: {
    trade_transaction_expiration_time: string;
  };
  trade_maximum_orders_change: {
    trade_maximum_orders: string;
  };
  trade_reset_all: undefined;
  trade_buy_pay_set: TradeType;
  trade_buy_receive_set: TradeType;
  trade_buy_click: TradeType;
  trade_sell_pay_set: TradeType;
  trade_sell_receive_set: TradeType;
  trade_sell_click: TradeType;
  trade_buy: TradeType;
  trade_sell: TradeType;
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

type EventStrategyEdit = {
  strategy_change_rates_click: StrategyType;
  strategy_change_rates: StrategyType;
  strategy_deposit_click: StrategyType;
  strategy_deposit: StrategyType;
  strategy_withdraw_click: StrategyType;
  strategy_withdraw: StrategyType;
  strategy_delete: StrategyType;
  strategy_duplicate_click: StrategyType;
  strategy_pause: StrategyType;
};

type EventNavigationSchema = {
  nav_home_click: undefined;
  nav_strategy_click: undefined;
  nav_trade_click: undefined;
  nav_notification_click: undefined;
  nav_wallet_connect_click: undefined;
  nav_wallet_click: undefined;
};

type EventWalletSchema = {
  wallet_connect_popup_view?: undefined;
  wallet_connect: { wallet_name: string; tos_approve: boolean };
  wallet_disconnect: { wallet_name: string };
};

type EventSchema = {
  general: EventGeneralSchema;
  strategy: EventStrategySchema;
  strategyEdit: EventStrategyEdit;
  navigation: EventNavigationSchema;
  wallet: EventWalletSchema;
  trade: EventTradeSchema;
  confirmation: EventTokenConfirmationSchema;
  transactionConfirmation: EventTransactionConfirmationSchema;
};

type EventGeneralSchemaNew = {
  changePage: {
    input: { referrer: string | null; test: number; sentryData: string };
    output: {
      page_referrer_spa: string | null;
    };
  };
};

type EventWalletSchemaNew = {
  walletConnectPopupView: {
    input: undefined;
    gtmData: undefined;
  };
  walletConnect: {
    input: { name: string; tos: boolean };
    gtmData: { wallet_name: string; tos_approve: boolean };
  };
};

type CarbonEventSchema = {
  general: EventGeneralSchemaNew;
  wallet: EventWalletSchemaNew;
};

export type SendEventFn = <
  T extends Extract<keyof CarbonEventSchema, string>,
  D extends Extract<keyof CarbonEventSchema[T], string>
>(
  type: T,
  event: D,
  // @ts-ignore
  data: CarbonEventSchema[T][D]['gtmData']
) => void;

export type CarbonEvents = {
  [key in keyof CarbonEventSchema]: {
    [key2 in keyof CarbonEventSchema[key]]: (
      // @ts-ignore
      input: CarbonEventSchema[key][key2]['input']
    ) => void;
  };
};
