export type GTMData = {
  event?: string;
  event_properties?: any;
  wallet?: { wallet_id: string; wallet_name: string } | {};
  page?:
    | {
        page_spa_referral: string;
        page_group: Page;
      }
    | {};
};

export enum Navigation {
  nav_home_click = 'nav_home_click',
  nav_strategy_click = 'nav_strategy_click',
  nav_trade_click = 'nav_trade_click',
  nav_notification_click = 'nav_notification_click',
  nav_wallet_connect_click = 'nav_wallet_connect_click',
  nav_wallet_click = 'nav_wallet_click',
}

export enum WalletConnect {
  wallet_connect_popup_view = 'wallet_connect_popup_view',
  wallet_connect = 'wallet_connect',
  wallet_disconnect = 'wallet_disconnect',
}

export enum Strategy {
  new_strategy_create_click = 'new_strategy_create_click',
  new_strategy_base_token_select = 'new_strategy_base_token_select',
  new_strategy_quote_token_select = 'new_strategy_quote_token_select',
  strategy_warning_show = 'strategy_warning_show',
  strategy_error_show = 'strategy_error_show',
  strategy_tooltip_show = 'strategy_tooltip_show',
  strategy_chart_close = 'strategy_chart_close',
  strategy_chart_open = 'strategy_chart_open',
  strategy_base_token_change = 'strategy_base_token_change',
  strategy_quote_token_change = 'strategy_quote_token_change',
  strategy_token_swap = 'strategy_token_swap',
  strategy_buy_low_order_type_change = 'strategy_buy_low_order_type_change',
  strategy_buy_low_price_set = 'strategy_buy_low_price_set',
  strategy_buy_low_budget_set = 'strategy_buy_low_budget_set',
  strategy_sell_high_order_type_change = 'strategy_sell_high_order_type_change',
  strategy_sell_high_price_set = 'strategy_sell_high_price_set',
  strategy_sell_high_budget_set = 'strategy_sell_high_budget_set',
  strategy_create_click = 'strategy_create_click',
  strategy_edit_click = 'strategy_edit_click',
  strategy_create = 'strategy_create',
  strategy_edit = 'strategy_edit',
}

export enum StrategyActions {
  strategy_duplicate = 'strategy_duplicate',
  strategy_delete = 'strategy_delete',
  strategy_change_rates_click = 'strategy_change_rates_click',
  strategy_change_rates = 'strategy_change_rates',
  strategy_deposit_click = 'strategy_deposit_click',
  strategy_deposit = 'strategy_deposit',
  strategy_withdraw_click = 'strategy_withdraw_click',
  strategy_withdraw = 'strategy_withdraw',
  strategy_pause = 'strategy_pause',
}

type Page =
  | 'home'
  | 'firstStrategy'
  | 'newStrategy'
  | 'createNewStrategy'
  | 'trade'
  | 'strategies';

export const routeMapping: { [key: string]: Page } = {
  '/': 'home',
  '/strategies/create': 'createNewStrategy',
  '/trade': 'trade',
};
