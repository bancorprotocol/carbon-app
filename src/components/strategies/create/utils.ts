import {
  CreateStrategyActionProps,
  OrderWithSetters,
  StrategySettings,
  TxStatus,
} from 'components/strategies/create/types';
import { QueryKey } from 'libs/queries';
import { PathNames, useNavigate } from 'libs/routing';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { carbonEvents } from 'services/events';
import { Dispatch, SetStateAction } from 'react';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';

export const handleStrategySettings = (
  strategySettings?: StrategySettings,
  functions?: ((value: boolean) => void)[]
) => {
  if (!functions || !strategySettings) {
    return;
  }

  switch (strategySettings) {
    case 'limit': {
      functions.forEach((fn) => fn(false));
      break;
    }
    case 'range': {
      functions.forEach((fn) => fn(true));
      break;
    }
    case 'custom': {
      functions.forEach((fn, i) => fn(i % 2 !== 0));
      break;
    }
  }
};

export const handleStrategyDirection = (
  strategyDirection: 'buy' | 'sell' | undefined,
  strategySettings: 'limit' | 'range' | 'custom' | undefined,
  order1: OrderWithSetters,
  order0: OrderWithSetters
) => {
  switch (strategyDirection) {
    case 'buy':
      handleStrategySettings(strategySettings, [order1.setIsRange]);
      order0.setPrice('0');
      break;
    case 'sell': {
      handleStrategySettings(strategySettings, [order0.setIsRange]);
      order1.setPrice('0');
      break;
    }
  }
};

export const createStrategyAction = async ({
  base,
  quote,
  order0,
  order1,
  user,
  cache,
  mutation,
  dispatchNotification,
  navigate,
  setStrategyTxStatus,
  strategyEventData,
}: CreateStrategyActionProps) => {
  if (!base || !quote || !user) {
    throw new Error('error in create strategy: missing data ');
  }

  setStrategyTxStatus('waitingForConfirmation');

  mutation.mutate(
    {
      base: base,
      quote: quote,
      order0: {
        budget: order0.budget,
        min: order0.min,
        max: order0.max,
        price: order0.price,
      },
      order1: {
        budget: order1.budget,
        min: order1.min,
        max: order1.max,
        price: order1.price,
      },
    },
    {
      onSuccess: async (tx) => {
        handleStrategyStatusAndRedirectToOverview(
          setStrategyTxStatus,
          navigate
        );

        dispatchNotification('createStrategy', { txHash: tx.hash });
        if (!tx) return;
        console.log('tx hash', tx.hash);
        await tx.wait();
        void cache.invalidateQueries({
          queryKey: QueryKey.balance(user, base.address),
        });
        void cache.invalidateQueries({
          queryKey: QueryKey.balance(user, quote.address),
        });

        console.log('tx confirmed');
        carbonEvents.strategy.strategyCreate(strategyEventData);
      },
      onError: (e) => {
        setStrategyTxStatus('initial');
        console.error('create mutation failed', e);
      },
    }
  );
};

export const handleStrategyStatusAndRedirectToOverview = (
  setStrategyTxStatus: Dispatch<SetStateAction<TxStatus>>,
  navigate?: ReturnType<typeof useNavigate<MyLocationGenerics>>
) => {
  setStrategyTxStatus('processing');
  setTimeout(() => {
    navigate && navigate({ to: PathNames.strategies });
    setStrategyTxStatus('initial');
  }, ONE_AND_A_HALF_SECONDS_IN_MS);
};

export const checkErrors = (
  order: OrderCreate,
  otherOrder: OrderCreate,
  balance?: string
) => {
  const minMaxCorrect =
    Number(order.min) > 0 && Number(order.max) > Number(order.min);
  const priceCorrect = Number(order.price) >= 0;
  const budgetCorrect =
    !order.budget || Number(order.budget) <= Number(balance);

  return (minMaxCorrect || priceCorrect) && budgetCorrect;
};

export const ctaButtonTextByTxStatus: {
  [key in TxStatus]: string;
} = {
  waitingForConfirmation: 'Waiting for Confirmation',
  processing: 'Processing',
  initial: 'Create Strategy',
};
