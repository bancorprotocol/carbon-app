import { useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyBudgetField } from 'components/strategies/edit/EditBudgetFields';
import { getTotalBudget } from 'components/strategies/edit/utils';
import {
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { EditBudgetForm } from 'components/strategies/edit/EditBudgetForm';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartLegend } from 'components/strategies/common/StrategyChartLegend';

export interface EditBudgetRecurringStrategySearch {
  priceStart?: string;
  priceEnd?: string;
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
    search.buyBudget,
  );
  const totalSellBudget = getTotalBudget(
    search.editType,
    order1.balance,
    search.sellBudget,
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
  const isLimit = {
    buy: order0.startRate === order0.endRate,
    sell: order1.startRate === order1.endRate,
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
      <EditBudgetForm
        strategyType="recurring"
        editType={search.editType}
        orders={orders}
        hasChanged={!isZero(search.buyBudget) || !isZero(search.sellBudget)}
      >
        <EditStrategyBudgetField
          editType={search.editType}
          order={orders.sell}
          budget={search.sellBudget ?? ''}
          initialOrder={strategy.order1}
          setOrder={setSellOrder}
          warning={search.editType === 'deposit' ? sellOutsideMarket : ''}
        />
        <EditStrategyBudgetField
          editType={search.editType}
          order={orders.buy}
          budget={search.buyBudget ?? ''}
          initialOrder={strategy.order0}
          setOrder={setBuyOrder}
          warning={search.editType === 'deposit' ? buyOutsideMarket : ''}
          buy
        />
      </EditBudgetForm>
      <StrategyChartSection>
        <StrategyChartHistory
          type="recurring"
          base={base}
          quote={quote}
          order0={orders.buy}
          order1={orders.sell}
          isLimit={isLimit}
          readonly
        />
        <StrategyChartLegend />
      </StrategyChartSection>
    </EditStrategyLayout>
  );
};
