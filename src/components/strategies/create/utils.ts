import {
  CreateStrategyActionProps,
  OrderWithSetters,
  StrategySettings,
} from 'components/strategies/create/types';
import { QueryKey } from 'libs/queries';
import { PathNames } from 'libs/routing';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { carbonEvents } from 'services/events';
import { Dispatch, SetStateAction } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';
import { NavigateOptions } from '@tanstack/react-router';

export const handleStrategySettings = (
  settings?: StrategySettings,
  functions?: ((value: boolean) => void)[]
) => {
  if (!functions || !settings) return;
  if (settings === 'overlapping') return functions.forEach((fn) => fn(true));
  if (settings === 'range') return functions.forEach((fn) => fn(true));
  if (settings === 'limit') return functions.forEach((fn) => fn(false));
};

export const handleStrategyDirection = (
  strategyDirection: 'buy' | 'sell' | undefined,
  strategySettings: StrategySettings | undefined,
  order1: OrderWithSetters,
  order0: OrderWithSetters
) => {
  switch (strategyDirection) {
    case 'buy':
      handleStrategySettings(strategySettings, [order1.setIsRange]);
      order0.setPrice('0');
      order0.setIsRange(false);
      break;
    case 'sell': {
      handleStrategySettings(strategySettings, [order0.setIsRange]);
      order1.setPrice('0');
      order1.setIsRange(false);
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
  setIsProcessing,
  strategyEventData,
}: CreateStrategyActionProps) => {
  if (!base || !quote || !user) {
    throw new Error('error in create strategy: missing data ');
  }

  mutation.mutate(
    {
      base: base,
      quote: quote,
      order0: {
        budget: order0.budget,
        min: order0.min,
        marginalPrice: order0.marginalPrice,
        max: order0.max,
        price: order0.price,
      },
      order1: {
        budget: order1.budget,
        min: order1.min,
        marginalPrice: order1.marginalPrice,
        max: order1.max,
        price: order1.price,
      },
    },
    {
      onSuccess: async (tx) => {
        handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);

        dispatchNotification('createStrategy', { txHash: tx.hash });
        await tx.wait();
        void cache.invalidateQueries({
          queryKey: QueryKey.balance(user, base.address),
        });
        void cache.invalidateQueries({
          queryKey: QueryKey.balance(user, quote.address),
        });
        navigate({ to: PathNames.strategies });
        carbonEvents.strategy.strategyCreate(strategyEventData);
      },
      onError: (e: any) => {
        setIsProcessing(false);
        console.error('create mutation failed', e);
        // TODO add error notification
        // TODO handle user rejected transaction
        // dispatchNotification('generic', {
        //   status: 'failed',
        //   title: 'Strategy creation failed',
        //   description:
        //     e.message || 'Unknown error - please try again or contact support',
        //   showAlert: true,
        // });
      },
    }
  );
};

export const handleTxStatusAndRedirectToOverview = (
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  navigate?: (opts: NavigateOptions) => Promise<void>
) => {
  setIsProcessing(true);
  setTimeout(() => {
    navigate?.({ to: PathNames.strategies });
    setIsProcessing(false);
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
