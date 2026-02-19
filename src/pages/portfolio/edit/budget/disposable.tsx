import { useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyBudgetField } from 'components/strategies/edit/EditBudgetFields';
import { getTotalBudget } from 'components/strategies/edit/utils';
import {
  isEmptyOrder,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { EditBudgetForm } from 'components/strategies/edit/EditBudgetForm';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { StrategyChartLegend } from 'components/strategies/common/StrategyChartLegend';
import { D3ChartDisposable } from 'components/strategies/common/d3Chart/disposable/D3ChartDisposable';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';

export interface EditBudgetDisposableStrategySearch {
  chartStart?: string;
  chartEnd?: string;
  marketPrice?: string;
  editType: 'deposit' | 'withdraw';
  buyBudget?: string;
  sellBudget?: string;
  buyMarginalPrice?: string;
  sellMarginalPrice?: string;
}
type Search = EditBudgetDisposableStrategySearch;

const url = '/strategies/edit/$strategyId/budget/disposable';
export const EditBudgetDisposablePage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, buy, sell } = strategy;
  const search = useSearch({ from: url });
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder<Search>(url);

  const isBuy = isZero(strategy.sell.min);

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

  const orders = {
    buy: {
      min: buy.min,
      max: buy.max,
      budget: totalBuyBudget,
      marginalPrice: search.buyMarginalPrice || buy.marginalPrice,
    },
    sell: {
      min: sell.min,
      max: sell.max,
      budget: totalSellBudget,
      marginalPrice: search.sellMarginalPrice || sell.marginalPrice,
    },
  };
  const isLimit = {
    buy: buy.min === buy.max,
    sell: sell.min === sell.max,
  };
  const direction = isEmptyOrder(buy) ? 'sell' : 'buy';

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

  const showBuy =
    isBuy || (search.editType === 'withdraw' && !isZero(buy.budget));
  const showSell =
    !isBuy || (search.editType === 'withdraw' && !isZero(sell.budget));

  return (
    <EditStrategyLayout editType={search.editType}>
      <StrategyChartSection>
        <StrategyChartHistory
          base={base}
          quote={quote}
          buy={orders.buy}
          sell={orders.sell}
          direction={direction}
        >
          <D3ChartDisposable isLimit={isLimit} prices={orders} />
          <TradeChartContent />
          <D3PricesAxis prices={orders} />
        </StrategyChartHistory>
        <StrategyChartLegend />
      </StrategyChartSection>
      <EditBudgetForm
        strategyType="disposable"
        editType={search.editType}
        orders={orders}
        hasChanged={!isZero(search.buyBudget) || !isZero(search.sellBudget)}
      >
        {showSell && (
          <EditStrategyBudgetField
            editType={search.editType}
            order={orders.sell}
            budget={search.sellBudget ?? ''}
            initialOrder={strategy.sell}
            setOrder={setSellOrder}
            warning={search.editType === 'deposit' ? sellOutsideMarket : ''}
            strategyType="disposable"
          />
        )}
        {showBuy && (
          <EditStrategyBudgetField
            editType={search.editType}
            order={orders.buy}
            budget={search.buyBudget ?? ''}
            initialOrder={strategy.buy}
            setOrder={setBuyOrder}
            warning={search.editType === 'deposit' ? buyOutsideMarket : ''}
            strategyType="disposable"
            isBuy
          />
        )}
      </EditBudgetForm>
    </EditStrategyLayout>
  );
};
