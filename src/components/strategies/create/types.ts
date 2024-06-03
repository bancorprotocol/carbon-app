import { OrderCreate } from 'components/strategies/create/useOrder';
import { QueryClient, UseMutationResult } from '@tanstack/react-query';
import { TransactionResponse } from '@ethersproject/providers';
import { CreateStrategyParams } from 'libs/queries';
import { DispatchNotification } from 'libs/notifications/types';
import { StrategyEventType } from 'services/events/types';
import { Dispatch, SetStateAction } from 'react';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication/useMarketIndication';
import { NavigateOptions, StrategySettings } from 'libs/routing';
import { Token } from 'libs/tokens';

export interface BaseOrder {
  min: string;
  max: string;
  marginalPrice: string;
  budget: string;
}

export interface OrderBlock extends BaseOrder {
  settings: StrategySettings;
}

type BaseCreateOrder = Pick<
  OrderCreate,
  'budget' | 'min' | 'max' | 'price' | 'marginalPrice'
>;

export interface CreateStrategyActionProps {
  base: Token;
  quote: Token;
  order0: BaseCreateOrder;
  order1: BaseCreateOrder;
  user?: string;
  cache: QueryClient;
  mutation: UseMutationResult<
    TransactionResponse,
    unknown,
    CreateStrategyParams,
    unknown
  >;
  dispatchNotification: DispatchNotification;
  navigate: (opts: NavigateOptions) => Promise<void>;
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
  strategyEventData: StrategyEventType & {
    buyMarketPricePercentage: MarketPricePercentage;
    sellMarketPricePercentage: MarketPricePercentage;
  };
}
