import {
  StrategyDirection,
  StrategySettings,
  StrategyType,
} from 'components/strategies/create/types';
import { ApprovalToken } from 'hooks/useApproval';
import { Token } from 'libs/tokens';

export interface TradeEventBase {
  buyToken: Token;
  sellToken: Token;
}

export interface TradeEventType extends TradeEventBase {
  buy?: boolean;
  valueUsd?: string;
}

export interface TransactionConfirmationType {
  blockchainNetwork: string;
  transactionHash?: string;
}

export type TokenConfirmationType = {
  isLimited?: boolean;
  approvalTokens: ApprovalToken[] | [Token];
  productType: 'trade' | 'strategy';
};

export interface StrategyEventType {
  strategyId?: string;
  baseToken: Token | undefined;
  quoteToken: Token | undefined;
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
