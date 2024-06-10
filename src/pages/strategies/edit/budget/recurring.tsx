import { useCallback } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { StrategyDirection } from 'libs/routing';
import { OrderBlock } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyBudgetField } from 'components/strategies/edit/NewEditBudgetFields';
import { getTotalBudget } from 'components/strategies/edit/utils';
import {
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { EditStrategyForm } from 'components/strategies/edit/NewEditStrategyForm';

export interface EditBudgetRecurringStrategySearch {
  action: 'deposit' | 'withdraw';
  buyBudget?: string;
  buyMarginalPrice?: string;
  sellBudget?: string;
  sellMarginalPrice?: string;
}

// TODO: merge that with create
type OrderKey = keyof EditBudgetRecurringStrategySearch;
const toOrderSearch = (
  order: Partial<OrderBlock>,
  direction: 'buy' | 'sell'
) => {
  const search: Partial<EditBudgetRecurringStrategySearch> = {};
  for (const [key, value] of Object.entries(order)) {
    const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
    const searchKey = `${direction}${camelCaseKey}` as OrderKey;
    search[searchKey] = value as any;
  }
  return search;
};

const url = '/strategies/edit/$strategyId/budget/recurring';

export const EditBudgetRecurringPage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const marketPrice = useMarketPrice({ base, quote });

  const totalBuyBudget = getTotalBudget(
    search.action,
    order0.balance,
    search.buyBudget
  );
  const totalSellBudget = getTotalBudget(
    search.action,
    order1.balance,
    search.sellBudget
  );

  const orders = {
    buy: {
      min: order0.startRate,
      max: order0.endRate,
      budget: totalBuyBudget,
      marginalPrice: search.buyMarginalPrice,
    },
    sell: {
      min: order1.startRate,
      max: order1.endRate,
      budget: totalSellBudget,
      marginalPrice: search.sellMarginalPrice,
    },
  };

  // Warnings
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order0.startRate,
    max: order0.endRate,
    buy: true,
  });
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order1.startRate,
    max: order1.endRate,
    buy: false,
  });

  // TODO: create a utils for that
  const setOrder = useCallback(
    (order: Partial<OrderBlock>, direction: StrategyDirection) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({
          ...previous,
          ...toOrderSearch(order, direction),
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const setSellOrder = useCallback(
    (order: Partial<OrderBlock>) => setOrder(order, 'sell'),
    [setOrder]
  );

  const setBuyOrder = useCallback(
    (order: Partial<OrderBlock>) => setOrder(order, 'buy'),
    [setOrder]
  );

  return (
    <EditStrategyForm
      strategyType="recurring"
      editType={search.action}
      orders={orders}
      hasChanged={!isZero(search.buyBudget) || !isZero(search.sellBudget)}
    >
      <EditStrategyBudgetField
        action={search.action}
        order={orders.sell}
        budget={search.sellBudget ?? ''}
        initialBudget={strategy.order1.balance}
        setOrder={setSellOrder}
        warning={search.action === 'deposit' ? sellOutsideMarket : ''}
      />
      <EditStrategyBudgetField
        action={search.action}
        order={orders.buy}
        budget={search.buyBudget ?? ''}
        initialBudget={strategy.order0.balance}
        setOrder={setBuyOrder}
        warning={search.action === 'deposit' ? buyOutsideMarket : ''}
        buy
      />
    </EditStrategyForm>
  );
};
