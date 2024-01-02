import { StrategyUpdate } from '@bancor/carbon-sdk';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { useNotifications } from 'hooks/useNotifications';
import {
  QueryKey,
  Strategy,
  useQueryClient,
  useUpdateStrategyQuery,
} from 'libs/queries';
import { useNavigate } from 'libs/routing';
import { useWeb3 } from 'libs/web3';
import { useState } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';
import { handleTxStatusAndRedirectToOverview } from './create/utils';

export const useUpdateStrategy = () => {
  const { user } = useWeb3();
  const { dispatchNotification } = useNotifications();
  const updateMutation = useUpdateStrategyQuery();
  const cache = useQueryClient();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const pauseStrategy = async (
    strategy: Strategy,
    successEventsCb?: () => void,
    closeModalCb?: () => void
  ) => {
    const { base, quote, encoded, id } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in update strategy: missing data ');
    }

    updateMutation.mutate(
      {
        id,
        encoded,
        fieldsToUpdate: {
          buyPriceLow: '0',
          buyPriceHigh: '0',
          sellPriceLow: '0',
          sellPriceHigh: '0',
        },
      },
      {
        onSuccess: async (tx) => {
          setIsProcessing(true);
          setTimeout(() => {
            closeModalCb?.();
            setIsProcessing(false);
          }, ONE_AND_A_HALF_SECONDS_IN_MS);

          dispatchNotification('pauseStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
          successEventsCb?.();
        },
        onError: (e) => {
          setIsProcessing(false);
          console.error('update mutation failed', e);
        },
      }
    );
  };

  const renewStrategy = async (
    strategy: Strategy,
    successEventsCb?: () => void
  ) => {
    const { base, quote, order0, order1, encoded, id } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in renew strategy: missing data ');
    }

    updateMutation.mutate(
      {
        id,
        encoded,
        fieldsToUpdate: {
          buyPriceLow: order0.startRate,
          buyPriceHigh: order0.endRate,
          sellPriceLow: order1.startRate,
          sellPriceHigh: order1.endRate,
        },
      },
      {
        onSuccess: async (tx) => {
          handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);

          dispatchNotification('renewStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
          successEventsCb?.();
        },
        onError: (e) => {
          setIsProcessing(false);
          console.error('update mutation failed', e);
        },
      }
    );
  };

  const changeRateStrategy = async (
    strategy: Strategy,
    buyMarginalPrice?: MarginalPriceOptions,
    sellMarginalPrice?: MarginalPriceOptions,
    successEventsCb?: () => void
  ) => {
    const { base, quote, order0, order1, encoded, id } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in change rates strategy: missing data ');
    }

    updateMutation.mutate(
      {
        id,
        encoded,
        fieldsToUpdate: {
          buyPriceLow: order0.startRate,
          buyPriceHigh: order0.endRate,
          sellPriceLow: order1.startRate,
          sellPriceHigh: order1.endRate,
        },
        buyMarginalPrice,
        sellMarginalPrice,
      },
      {
        onSuccess: async (tx) => {
          handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);

          dispatchNotification('changeRatesStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
          successEventsCb?.();
        },
        onError: (e) => {
          setIsProcessing(false);
          console.error('update mutation failed', e);
        },
      }
    );
  };

  const withdrawBudget = async (
    strategy: Strategy,
    buyMarginalPrice?: MarginalPriceOptions,
    sellMarginalPrice?: MarginalPriceOptions,
    successEventsCb?: () => void
  ) => {
    const { base, quote, order0, order1, encoded, id } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in withdraw strategy budget: missing data ');
    }

    const fieldsToUpdate: StrategyUpdate = Object.assign({});

    if (buyMarginalPrice) {
      fieldsToUpdate.buyBudget = order0.balance;
    }

    if (sellMarginalPrice) {
      fieldsToUpdate.sellBudget = order1.balance;
    }

    updateMutation.mutate(
      {
        id,
        encoded,
        fieldsToUpdate,
        buyMarginalPrice,
        sellMarginalPrice,
      },
      {
        onSuccess: async (tx) => {
          handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);

          dispatchNotification('withdrawStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
          successEventsCb?.();
        },
        onError: (e) => {
          setIsProcessing(false);
          console.error('update mutation failed', e);
        },
      }
    );
  };

  const depositBudget = async (
    strategy: Strategy,
    buyMarginalPrice?: MarginalPriceOptions,
    sellMarginalPrice?: MarginalPriceOptions,
    successEventsCb?: () => void
  ) => {
    const { base, quote, order0, order1, encoded, id } = strategy;

    if (!base || !quote || !user) {
      throw new Error('error in deposit strategy budget: missing data');
    }

    const fieldsToUpdate: StrategyUpdate = Object.assign({});

    if (buyMarginalPrice) {
      fieldsToUpdate.buyBudget = order0.balance;
    }

    if (sellMarginalPrice) {
      fieldsToUpdate.sellBudget = order1.balance;
    }

    updateMutation.mutate(
      {
        id,
        encoded,
        fieldsToUpdate,
        buyMarginalPrice,
        sellMarginalPrice,
      },
      {
        onSuccess: async (tx) => {
          handleTxStatusAndRedirectToOverview(setIsProcessing, navigate);

          dispatchNotification('depositStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
          successEventsCb?.();
        },
        onError: (e) => {
          setIsProcessing(false);
          console.error('update mutation failed', e);
        },
      }
    );
  };

  return {
    pauseStrategy,
    renewStrategy,
    changeRateStrategy,
    withdrawBudget,
    depositBudget,
    isProcessing,
    setIsProcessing,
    updateMutation,
  };
};
