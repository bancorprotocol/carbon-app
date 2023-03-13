import { MarginalPriceOptions } from '@bancor/carbon-sdk';
import { useNotifications } from 'hooks/useNotifications';
import {
  QueryKey,
  Strategy,
  useQueryClient,
  useUpdateStrategyQuery,
} from 'libs/queries';
import { useWeb3 } from 'libs/web3';

export const useUpdateStrategy = () => {
  const { user } = useWeb3();
  const { dispatchNotification } = useNotifications();
  const updateMutation = useUpdateStrategyQuery();
  const cache = useQueryClient();

  const pauseStrategy = async (strategy: Strategy) => {
    const { token0, token1, encoded } = strategy;

    if (!token0 || !token1 || !user) {
      throw new Error('error in update strategy: missing data ');
    }

    updateMutation.mutate(
      {
        token0,
        token1,
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
          dispatchNotification('pauseStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
          console.error('update mutation failed', e);
        },
      }
    );
  };

  const renewStrategy = async (strategy: Strategy) => {
    const { token0, token1, order0, order1, encoded } = strategy;

    if (!token0 || !token1 || !user) {
      throw new Error('error in renew strategy: missing data ');
    }

    updateMutation.mutate(
      {
        token0,
        token1,
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
          dispatchNotification('renewStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
          console.error('update mutation failed', e);
        },
      }
    );
  };

  const changeRateStrategy = async (strategy: Strategy) => {
    const { token0, token1, order0, order1, encoded } = strategy;

    if (!token0 || !token1 || !user) {
      throw new Error('error in change rates strategy: missing data ');
    }

    updateMutation.mutate(
      {
        token0,
        token1,
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
          dispatchNotification('changeRatesStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
          console.error('update mutation failed', e);
        },
      }
    );
  };

  const withdrawBudget = async (
    strategy: Strategy,
    buyMarginalPrice?: MarginalPriceOptions,
    sellMarginalPrice?: MarginalPriceOptions
  ) => {
    const { token0, token1, order0, order1, encoded } = strategy;

    if (!token0 || !token1 || !user) {
      throw new Error('error in withdraw strategy budget: missing data ');
    }

    updateMutation.mutate(
      {
        token0,
        token1,
        encoded,
        fieldsToUpdate: {
          buyBudget: order0.balance,
          sellBudget: order1.balance,
        },
        buyMarginalPrice,
        sellMarginalPrice,
      },
      {
        onSuccess: async (tx) => {
          dispatchNotification('withdrawStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
          console.error('update mutation failed', e);
        },
      }
    );
  };

  const depositBudget = async (
    strategy: Strategy,
    buyMarginalPrice?: MarginalPriceOptions,
    sellMarginalPrice?: MarginalPriceOptions
  ) => {
    const { token0, token1, order0, order1, encoded } = strategy;

    if (!token0 || !token1 || !user) {
      throw new Error('error in deposit strategy budget: missing data ');
    }

    updateMutation.mutate(
      {
        token0,
        token1,
        encoded,
        fieldsToUpdate: {
          buyBudget: order0.balance,
          sellBudget: order1.balance,
        },
        buyMarginalPrice,
        sellMarginalPrice,
      },
      {
        onSuccess: async (tx) => {
          dispatchNotification('depositStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();

          void cache.invalidateQueries({
            queryKey: QueryKey.strategies(user),
          });
          console.log('tx confirmed');
        },
        onError: (e) => {
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
  };
};
