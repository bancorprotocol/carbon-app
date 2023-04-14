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

export interface StrategyEventTypeBase {
  baseToken: Token | undefined;
  quoteToken: Token | undefined;
  strategyType: StrategyType | undefined;
  strategyDirection: StrategyDirection | undefined;
  strategySettings: StrategySettings | undefined;
}

export interface StrategyBuyEventType {
  buyTokenPrice: string;
  buyTokenPriceMin: string;
  buyTokenPriceMax: string;
  buyOrderType: string;
  buyBudget: string;
  buyBudgetUsd: string;
}

export interface StrategySellEventType {
  sellTokenPrice: string;
  sellTokenPriceMin: string;
  sellTokenPriceMax: string;
  sellOrderType: string;
  sellBudget: string;
  sellBudgetUsd: string;
}

export interface StrategyEventType
  extends StrategyEventTypeBase,
    StrategyBuyEventType,
    StrategySellEventType {}

export interface StrategyEditEventType
  extends StrategyEventTypeBase,
    StrategyBuyEventType,
    StrategySellEventType {
  strategyId: string;
}

export type StrategyEventOrTradeEvent = TradeEventType | StrategyEventType;
