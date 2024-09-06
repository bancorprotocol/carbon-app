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
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';

export interface EditBudgetDisposableStrategySearch {
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
  const { base, quote, order0, order1 } = strategy;
  const search = useSearch({ from: url });
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder<Search>(url);

  const buy = isZero(strategy.order1.startRate);

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
      marginalPrice: search.buyMarginalPrice || order0.marginalRate,
    },
    sell: {
      min: order1.startRate,
      max: order1.endRate,
      budget: totalSellBudget,
      marginalPrice: search.sellMarginalPrice || order1.marginalRate,
    },
  };
  const isLimit = {
    buy: order0.startRate === order0.endRate,
    sell: order1.startRate === order1.endRate,
  };
  const direction =
    isZero(order0.startRate) && isZero(order0.endRate) ? 'sell' : 'buy';

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

  const showBuy =
    buy || (search.editType === 'withdraw' && !isZero(order0.balance));
  const showSell =
    !buy || (search.editType === 'withdraw' && !isZero(order1.balance));

  return (
    <EditStrategyLayout editType={search.editType}>
      <EditStrategyForm
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
            initialBudget={strategy.order1.balance}
            setOrder={setSellOrder}
            warning={search.editType === 'deposit' ? sellOutsideMarket : ''}
          />
        )}
        {showBuy && (
          <EditStrategyBudgetField
            editType={search.editType}
            order={orders.buy}
            budget={search.buyBudget ?? ''}
            initialBudget={strategy.order0.balance}
            setOrder={setBuyOrder}
            warning={search.editType === 'deposit' ? buyOutsideMarket : ''}
            buy
          />
        )}
      </EditStrategyForm>
      <StrategyChartSection>
        <StrategyChartHistory
          type="disposable"
          base={base}
          quote={quote}
          order0={orders.buy}
          order1={orders.sell}
          isLimit={isLimit}
          direction={direction}
          readonly={true}
        />
      </StrategyChartSection>
    </EditStrategyLayout>
  );
};
