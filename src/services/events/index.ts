import { StrategyDirection, StrategyType } from 'libs/routing';
import { sendGTMEvent } from './googleTagManager';
import { CarbonEventsInput } from './googleTagManager/types';

interface GeneralProps {
  changePage: {
    referrer: string | null;
  };
}
const generalEvents: CarbonEventsInput<GeneralProps> = {
  changePage: ({ referrer }: { referrer: string | null }) => {
    sendGTMEvent('general', 'changePage', {
      page_referrer_spa: referrer ? referrer : null,
    });
  },
};

// STRATEGY

interface StrategyProps {
  createStrategy: {
    token_pair: string;
    strategy_base_token: string;
    strategy_quote_token: string;
    strategy_category: 'static' | 'gradient';
    strategy_type: StrategyType;
  };
}
const strategyEvents: CarbonEventsInput<StrategyProps> = {
  createStrategy: (params) => {
    sendGTMEvent('wallet', 'walletConnect', params);
  },
};

// WALLET

interface WalletProps {
  walletConnect: { address: string | undefined; name: string };
  walletConnected: { address: string | undefined; name: string };
  walletDisconnect: { address: string | undefined };
  walletDisconnected: undefined;
}
const walletEvents: CarbonEventsInput<WalletProps> = {
  walletConnect: ({ name, address }) => {
    sendGTMEvent('wallet', 'walletConnect', {
      wallet_name: name,
      wallet_id: address,
    });
  },
  walletConnected: ({ name, address }) => {
    sendGTMEvent('wallet', 'walletConnect', {
      wallet_name: name,
      wallet_id: address,
    });
  },
  walletDisconnect: ({ address }) => {
    sendGTMEvent('wallet', 'walletConnect', { wallet_id: address });
  },
  walletDisconnected: () => {
    sendGTMEvent('wallet', 'walletDisconnected', {});
  },
};

// TRADE
interface TradeEventType {
  trade_direction: StrategyDirection;
  token_pair: string;
  buy_token: string;
  sell_token: string;
  value_usd: string;
}
interface TransactionEvent {
  transaction_hash: string;
  blockchain_network: string;
}

interface TradeProps {
  tradeBuy: TradeEventType & TransactionEvent;
  tradeSell: TradeEventType & TransactionEvent;
  tradeWarningShow: { message: string };
  tradeErrorShow: { buy_token: string; sell_token: string; message: string };
}

const tradeEvents: CarbonEventsInput<TradeProps> = {
  tradeBuy: (params) => sendGTMEvent('trade', 'tradeBuy', params),
  tradeSell: (params) => sendGTMEvent('trade', 'tradeSell', params),
  tradeErrorShow: (params) => sendGTMEvent('trade', 'tradeErrorShow', params),
  tradeWarningShow: (params) =>
    sendGTMEvent('trade', 'tradeWarningShow', params),
};

// Explore
interface ExploreProps {
  exploreSearch: { explore_search: string };
}
const exploreEvents: CarbonEventsInput<ExploreProps> = {
  exploreSearch: (params) => sendGTMEvent('explore', 'exploreSearch', params),
};

export const carbonEvents = {
  general: generalEvents,
  wallet: walletEvents,
  strategy: strategyEvents,
  trade: tradeEvents,
  explore: exploreEvents,
};
