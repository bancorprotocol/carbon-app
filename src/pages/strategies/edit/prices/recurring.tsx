import { useCallback } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { roundSearchParam } from 'utils/helpers';
import { EditStrategyPriceField } from 'components/strategies/edit/NewEditPriceFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { BaseOrder, OrderBlock } from 'components/strategies/common/types';
import { Order } from 'libs/queries';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyForm } from 'components/strategies/edit/NewEditStrategyForm';

export interface EditRecurringStrategySearch {
  editType: 'editPrices' | 'renew';
  buyMin: string;
  buyMax: string;
  buySettings: StrategySettings;
  sellMin: string;
  sellMax: string;
  sellSettings: StrategySettings;
}

// TODO: merge that with create
type OrderKey = keyof EditRecurringStrategySearch;
const toOrderSearch = (
  order: Partial<OrderBlock>,
  direction: 'buy' | 'sell'
) => {
  const search: Partial<EditRecurringStrategySearch> = {};
  for (const [key, value] of Object.entries(order)) {
    const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
    const searchKey = `${direction}${camelCaseKey}` as OrderKey;
    search[searchKey] = value as any;
  }
  return search;
};

const getWarning = (search: EditRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const sellMinInRange =
    buyMin && buyMax && sellMin && +sellMin >= +buyMin && +sellMin < +buyMax;
  const buyMaxInRange =
    sellMin && sellMax && buyMax && +buyMax >= +sellMin && +buyMax < +sellMax;
  if (sellMinInRange || buyMaxInRange) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

const getError = (search: EditRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const minReversed = buyMin && sellMin && +buyMin > +sellMin;
  const maxReversed = buyMax && sellMax && +buyMax > +sellMax;
  if (minReversed || maxReversed) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

const url = '/strategies/edit/$strategyId/prices/recurring';

export const EditStrategyRecurringPage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const marketPrice = useMarketPrice({ base, quote });

  const orders = {
    buy: {
      min: search.buyMin,
      max: search.buyMax,
      budget: strategy.order0.balance,
      settings: search.buySettings,
    },
    sell: {
      min: search.sellMin,
      max: search.sellMax,
      budget: strategy.order1.balance,
      settings: search.sellSettings,
    },
  };

  const hasChanged = (() => {
    const { order0, order1 } = strategy;
    if (search.buyMin !== roundSearchParam(order0.startRate)) return true;
    if (search.buyMax !== roundSearchParam(order0.endRate)) return true;
    if (search.sellMin !== roundSearchParam(order1.startRate)) return true;
    if (search.sellMax !== roundSearchParam(order1.endRate)) return true;
    return false;
  })();

  // Warnings
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.sellMin,
    max: search.sellMax,
    buy: false,
  });
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.buyMin,
    max: search.buyMax,
    buy: true,
  });

  const error = getError(search);

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

  // WHAT TO DO ?
  const getMarginalOption = (oldOrder: Order, newOrder: BaseOrder) => {
    if (search.editType !== 'editPrices') return;
    if (oldOrder.startRate !== newOrder.min) return MarginalPriceOptions.reset;
    if (oldOrder.endRate !== newOrder.max) return MarginalPriceOptions.reset;
  };

  return (
    <EditStrategyForm
      strategyType="recurring"
      editType={search.editType}
      orders={orders}
      hasChanged={hasChanged}
    >
      <EditStrategyPriceField
        order={orders.sell}
        initialBudget={strategy.order1.balance}
        setOrder={setSellOrder}
        warnings={[sellOutsideMarket, getWarning(search)]}
        error={error}
      />
      <EditStrategyPriceField
        order={orders.buy}
        initialBudget={strategy.order0.balance}
        setOrder={setBuyOrder}
        warnings={[buyOutsideMarket, getWarning(search)]}
        error={error}
        buy
      />
    </EditStrategyForm>
  );
};
