import { MakeGenerics, useNavigate } from 'libs/routing';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { QueryClient, UseMutationResult } from '@tanstack/react-query';
import { TransactionResponse } from '@ethersproject/providers';
import { CreateStrategyParams } from 'libs/queries';
import { DispatchNotification } from 'libs/notifications/types';
import { UseStrategyCreateReturn } from 'components/strategies/create';

export type StrategyType = 'recurring' | 'disposable';
export type StrategyDirection = 'buy' | 'sell';
export type StrategySettings = 'limit' | 'range' | 'custom';

export type StrategyCreateLocationGenerics = MakeGenerics<{
  Search: {
    base?: string;
    quote?: string;
    strategyType?: StrategyType;
    strategyDirection?: StrategyDirection;
    strategySettings?: StrategySettings;
  };
}>;

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
  navigate: ReturnType<typeof useNavigate<StrategyCreateLocationGenerics>>;
};
