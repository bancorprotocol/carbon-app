import { OrderCreate } from 'components/strategies/create/useOrder';
import { QueryClient, UseMutationResult } from '@tanstack/react-query';
import { TransactionResponse } from '@ethersproject/providers';
import { CreateStrategyParams } from 'libs/queries';
import { DispatchNotification } from 'libs/notifications/types';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { StrategyEventType } from 'services/events/types';
import { Dispatch, SetStateAction } from 'react';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication/useMarketIndication';
import { NavigateOptions } from '@tanstack/react-router';

export type StrategyType = 'recurring' | 'disposable';
export type StrategyDirection = 'buy' | 'sell';

export type LimitRange = 'limit' | 'range';
export type StrategySettings =
  | LimitRange
  | `${LimitRange}_${LimitRange}`
  | 'overlapping';

export interface StrategyCreateSearch {
  base?: string;
  quote?: string;
  strategyDirection?: StrategyDirection;
  strategySettings?: StrategySettings;
}

export type OrderWithSetters = {
  setIsRange: (value: ((prevState: boolean) => boolean) | boolean) => void;
  setPrice: (value: ((prevState: string) => string) | string) => void;
  setBudget: (value: ((prevState: string) => string) | string) => void;
};

export type CreateStrategyActionProps = Pick<
  UseStrategyCreateReturn,
  'base' | 'quote'
> & {
  order0: OrderCreate;
  order1: OrderCreate;
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
};
