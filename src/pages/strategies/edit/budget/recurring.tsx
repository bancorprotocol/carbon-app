import { useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyBudgetField } from 'components/strategies/edit/EditBudgetFields';
import { getTotalBudget } from 'components/strategies/edit/utils';
import {
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';

export interface EditBudgetRecurringStrategySearch {
  editType: 'deposit' | 'withdraw';
  buyBudget?: string;
  buyMarginalPrice?: string;
  sellBudget?: string;
  sellMarginalPrice?: string;
}

type Search = EditBudgetRecurringStrategySearch;

const url = '/strategies/edit/$strategyId/budget/recurring';

export const EditBudgetRecurringPage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const search = useSearch({ from: url });
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder<Search>(url);

  const totalBuyBudget = getTotalBudget(
    search.editType,
    order0.balance,
    search.buyBudget
  );
  const totalSellBudget = getTotalBudget(
    search.editType,
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

  return (
    <EditStrategyLayout editType={search.editType}>
      <EditStrategyForm
        strategyType="recurring"
        editType={search.editType}
        orders={orders}
        hasChanged={!isZero(search.buyBudget) || !isZero(search.sellBudget)}
      >
        <EditStrategyBudgetField
          editType={search.editType}
          order={orders.sell}
          budget={search.sellBudget ?? ''}
          initialBudget={strategy.order1.balance}
          setOrder={setSellOrder}
          warning={search.editType === 'deposit' ? sellOutsideMarket : ''}
        />
        <EditStrategyBudgetField
          editType={search.editType}
          order={orders.buy}
          budget={search.buyBudget ?? ''}
          initialBudget={strategy.order0.balance}
          setOrder={setBuyOrder}
          warning={search.editType === 'deposit' ? buyOutsideMarket : ''}
          buy
        />
      </EditStrategyForm>
    </EditStrategyLayout>
  );
};
