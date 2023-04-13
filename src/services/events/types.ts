import {
  StrategyDirection,
  StrategySettings,
  StrategyType,
} from 'components/strategies/create/types';

export interface TradeEventType {
  tradeDirection?: string;
  buyToken?: string;
  sellToken?: string;
  valueUsd?: string;
  blockchainNetwork?: string;
  transactionHash?: string;
  message?: string;
}

export type ConfirmationEventType = {
  isLimited?: boolean;
  token: string | string[];
  productType: 'trade' | 'strategy';
};

export interface StrategyEventType {
  strategyId?: string;
  baseToken: string;
  quoteToken: string;
  buyTokenPrice?: string;
  buyTokenPriceMin?: string;
  buyTokenPriceMax?: string;
  buyOrderType?: string;
  buyBudget?: string;
  buyBudgetUsd?: string;
  sellTokenPrice?: string;
  sellTokenPriceMin?: string;
  sellTokenPriceMax?: string;
  sellOrderType?: string;
  sellBudget?: string;
  sellBudgetUsd?: string;
  strategyType?: StrategyType;
  strategyDirection?: StrategyDirection;
  strategySettings?: StrategySettings;
}

export type StrategyEventOrTradeEvent = TradeEventType | StrategyEventType;
