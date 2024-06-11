import { useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyBudgetField } from 'components/strategies/edit/EditBudgetFields';
import { getTotalBudget } from 'components/strategies/edit/utils';
import {
  isZero,
  outSideMarketWarning,
  toBaseOrder,
} from 'components/strategies/common/utils';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import { useSetDisposableOrder } from 'components/strategies/common/useSetOrder';

export interface EditBudgetDisposableStrategySearch {
  editType: 'deposit' | 'withdraw';
  budget?: string;
  marginalPrice?: string;
}

const url = '/strategies/edit/$strategyId/budget/disposable';
export const EditBudgetDisposablePage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const search = useSearch({ from: url });
  const marketPrice = useMarketPrice({ base, quote });
  const { setOrder } = useSetDisposableOrder(url);

  const buy = isZero(strategy.order1.startRate);
  const initialOrder = buy ? strategy.order0 : strategy.order1;

  const totalBudget = getTotalBudget(
    search.editType,
    initialOrder.balance,
    search.budget
  );

  const order = {
    min: initialOrder.startRate,
    max: initialOrder.endRate,
    budget: totalBudget,
    marginalPrice: search.marginalPrice,
  };

  const orders = {
    buy: buy ? order : toBaseOrder(strategy.order0),
    sell: buy ? toBaseOrder(strategy.order1) : order,
  };

  // Warnings
  const outsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: order.min,
    max: order.max,
    buy: buy,
  });

  return (
    <EditStrategyForm
      strategyType="disposable"
      editType={search.editType}
      orders={orders}
      hasChanged={!isZero(search.budget)}
    >
      <EditStrategyBudgetField
        editType={search.editType}
        order={order}
        budget={search.budget ?? ''}
        initialBudget={initialOrder.balance}
        setOrder={setOrder}
        warning={search.editType === 'deposit' ? outsideMarket : ''}
        buy={buy}
      />
    </EditStrategyForm>
  );
};
