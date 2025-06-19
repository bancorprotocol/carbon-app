import { SafeDecimal } from 'libs/safedecimal';
import { QueryKey, useQueryClient, useUpdateStrategyQuery } from 'libs/queries';
import {
  getStrategyType,
  isGradientStrategy,
  isZero,
} from 'components/strategies/common/utils';
import {
  toDisposablePricesSearch,
  toOverlappingPricesSearch,
  toRecurringPricesSearch,
} from 'libs/routing/routes/strategyEdit';
import { AnyStrategy, EditOrders, Strategy } from '../common/types';
import { StrategyUpdate } from '@bancor/carbon-sdk';
import { useNotifications } from 'hooks/useNotifications';
import { useWagmi } from 'libs/wagmi';

export const getDeposit = (initialBudget?: string, newBudget?: string) => {
  const value = new SafeDecimal(newBudget || '0').sub(initialBudget || '0');
  if (value.lte(0)) return '';
  return value.toString();
};
export const getWithdraw = (initialBudget?: string, newBudget?: string) => {
  const value = new SafeDecimal(initialBudget || '0').sub(newBudget || '0');
  if (value.lte(0)) return '';
  return value.toString();
};

export const getTotalBudget = (
  editType: 'deposit' | 'withdraw',
  initialBudget: string = '0',
  budget: string = '0',
) => {
  if (isZero(budget)) return initialBudget;
  if (editType === 'deposit') {
    return new SafeDecimal(initialBudget).add(budget).toString();
  } else {
    return new SafeDecimal(initialBudget).sub(budget).toString();
  }
};

export const getEditPricesPage = (
  strategy: Strategy,
  editType: 'editPrices' | 'renew',
) => {
  const type = getStrategyType(strategy);
  if (type === 'disposable') {
    return {
      to: '/strategies/edit/$strategyId/prices/disposable',
      search: toDisposablePricesSearch(strategy, editType),
    };
  }
  if (type === 'overlapping') {
    return {
      to: '/strategies/edit/$strategyId/prices/overlapping',
      search: toOverlappingPricesSearch(strategy, editType),
    };
  }
  return {
    to: '/strategies/edit/$strategyId/prices/recurring',
    search: toRecurringPricesSearch(strategy, editType),
  };
};
export const getEditBudgetPage = (
  strategy: Strategy,
  editType: 'withdraw' | 'deposit',
) => {
  const type = getStrategyType(strategy);

  if (type === 'disposable') {
    return {
      to: '/strategies/edit/$strategyId/budget/disposable',
      search: { editType },
    };
  }
  if (type === 'overlapping') {
    return {
      to: '/strategies/edit/$strategyId/budget/overlapping',
      search: { editType },
    };
  }
  return {
    to: '/strategies/edit/$strategyId/budget/recurring',
    search: { editType },
  };
};

export const getFieldsToUpdate = (orders: EditOrders, strategy: Strategy) => {
  const { buy, sell } = orders;
  const fields: Partial<StrategyUpdate> = {};
  if (buy.min !== strategy.buy.min) fields.buyPriceLow = buy.min;
  if (buy.max !== strategy.buy.max) fields.buyPriceHigh = buy.max;
  if (buy.budget !== strategy.buy.budget) fields.buyBudget = buy.budget;
  if (sell.min !== strategy.sell.min) fields.sellPriceLow = sell.min;
  if (sell.max !== strategy.sell.max) fields.sellPriceHigh = sell.max;
  if (sell.budget !== strategy.sell.budget) fields.sellBudget = sell.budget;
  return fields as StrategyUpdate;
};

/** Transform a strategy into Disposable Sell */
export const useEditToDisposableSell = (strategy: AnyStrategy) => {
  const updateMutation = useUpdateStrategyQuery();
  const { dispatchNotification } = useNotifications();
  const { user } = useWagmi();
  const cache = useQueryClient();
  return () => {
    if (isGradientStrategy(strategy)) {
      return console.error('Cannot change a gradient strategy into disposable');
    }
    const orders = {
      buy: {
        min: '0',
        max: '0',
        marginalPrice: '0',
        budget: '0',
      },
      sell: strategy.sell,
    };
    updateMutation.mutate(
      {
        id: strategy.id,
        encoded: strategy.encoded,
        fieldsToUpdate: getFieldsToUpdate(orders, strategy),
        buyMarginalPrice: orders.buy.marginalPrice,
        sellMarginalPrice: orders.sell.marginalPrice,
      },
      {
        onSuccess: async (tx) => {
          dispatchNotification('changeRatesStrategy', { txHash: tx.hash });
          if (!tx) return;
          console.log('tx hash', tx.hash);
          await tx.wait();
          cache.invalidateQueries({
            queryKey: QueryKey.strategiesByUser(user),
          });
        },
        onError: (e) => {
          console.error('update mutation failed', e);
        },
      },
    );
  };
};
