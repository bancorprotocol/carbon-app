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
import { D3ChartRecurring } from 'components/strategies/common/d3Chart/recurring/D3ChartRecurring';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';
import { EditOrders } from 'components/strategies/common/types';

export interface EditBudgetRecurringStrategySearch {
  chartStart?: string;
  chartEnd?: string;
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
  const { base, quote, buy, sell } = strategy;
  const search = useSearch({ from: url });
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder<Search>(url);

  const totalBuyBudget = getTotalBudget(
    search.editType,
    buy.budget,
    search.buyBudget,
  );
  const totalSellBudget = getTotalBudget(
    search.editType,
    sell.budget,
    search.sellBudget,
  );

  const orders: EditOrders = {
    buy: {
      min: buy.min,
      max: buy.max,
      budget: totalBuyBudget,
      marginalPrice: search.buyMarginalPrice,
    },
    sell: {
      min: sell.min,
      max: sell.max,
      budget: totalSellBudget,
      marginalPrice: search.sellMarginalPrice,
    },
  };
  const isLimit = {
    buy: buy.min === buy.max,
    sell: sell.min === sell.max,
  };

  // Warnings
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: buy.min,
    max: buy.max,
    isBuy: true,
  });
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: sell.min,
    max: sell.max,
    isBuy: false,
  });

  return (
    <EditStrategyLayout editType={search.editType}>
      <StrategyChartSection>
        <StrategyChartHistory
          base={base}
          quote={quote}
          buy={orders.buy}
          sell={orders.sell}
        >
          <D3ChartRecurring
            base={base}
            quote={quote}
            isLimit={isLimit}
            prices={orders}
          />
          <TradeChartContent />
          <D3PricesAxis prices={orders} />
        </StrategyChartHistory>
        <StrategyChartLegend />
      </StrategyChartSection>
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
          initialOrder={strategy.sell}
          setOrder={setSellOrder}
          warning={search.editType === 'deposit' ? sellOutsideMarket : ''}
        />
        <EditStrategyBudgetField
          editType={search.editType}
          order={orders.buy}
          budget={search.buyBudget ?? ''}
          initialOrder={strategy.buy}
          setOrder={setBuyOrder}
          warning={search.editType === 'deposit' ? buyOutsideMarket : ''}
          isBuy
        />
      </EditBudgetForm>
    </EditStrategyLayout>
  );
};
