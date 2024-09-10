import { useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import {
  isZero,
  isOverlappingStrategy,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import {
  checkIfOrdersOverlap,
  checkIfOrdersReversed,
} from 'components/strategies/utils';
import { getTotalBudget } from 'components/strategies/edit/utils';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { OnPriceUpdates } from 'components/simulator/input/d3Chart';
import { useCallback } from 'react';
import { EditOrderBlock } from 'components/strategies/common/types';
import { Strategy } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';

export interface EditRecurringStrategySearch {
  editType: 'editPrices' | 'renew';
  buyMin?: string;
  buyMax?: string;
  buySettings: StrategySettings;
  buyBudget?: string;
  buyAction?: 'deposit' | 'withdraw';
  sellMin?: string;
  sellMax?: string;
  sellSettings: StrategySettings;
  sellBudget?: string;
  sellAction?: 'deposit' | 'withdraw';
}

type Search = EditRecurringStrategySearch;

const getOrders = (
  strategy: Strategy,
  search: Search,
  marketPrice?: number
): { buy: EditOrderBlock; sell: EditOrderBlock } => {
  const { order0, order1 } = strategy;

  const defaultMin = (
    direction: StrategyDirection,
    settings: StrategySettings
  ) => {
    const isBuy = direction === 'buy';
    const defaultPrice = isBuy ? order0.startRate : order1.endRate;
    const price = isZero(defaultPrice) ? marketPrice : defaultPrice;
    const multiplier = (() => {
      if (isZero(defaultPrice)) {
        if (isBuy) return settings === 'limit' ? 0.9 : 0.8;
        else return settings === 'limit' ? 1.1 : 1.1;
      } else {
        if (isBuy) return settings === 'limit' ? 1 : 0.9;
        else return settings === 'limit' ? 1 : 1;
      }
    })();
    return new SafeDecimal(price ?? 0).mul(multiplier).toString();
  };
  const defaultMax = (
    direction: StrategyDirection,
    settings: StrategySettings
  ) => {
    const isBuy = direction === 'buy';
    const defaultPrice = isBuy ? order0.startRate : order1.endRate;
    const price = isZero(defaultPrice) ? marketPrice : defaultPrice;
    const multiplier = (() => {
      if (isZero(defaultPrice)) {
        if (isBuy) return settings === 'limit' ? 0.9 : 0.9;
        else return settings === 'limit' ? 1.1 : 1.2;
      } else {
        if (isBuy) return settings === 'limit' ? 1 : 1;
        else return settings === 'limit' ? 1 : 1.1;
      }
    })();
    return new SafeDecimal(price ?? 0).mul(multiplier).toString();
  };
  return {
    buy: {
      min: search.buyMin ?? defaultMin('buy', search.buySettings) ?? '',
      max: search.buyMax ?? defaultMax('buy', search.buySettings) ?? '',
      settings: search.buySettings,
      action: search.buyAction ?? 'deposit',
      budget: getTotalBudget(
        search.buyAction ?? 'deposit',
        order0.balance,
        search.buyBudget
      ),
    },
    sell: {
      min: search.sellMin ?? defaultMin('sell', search.sellSettings) ?? '',
      max: search.sellMax ?? defaultMax('sell', search.sellSettings) ?? '',
      settings: search.sellSettings,
      action: search.sellAction ?? 'deposit',
      budget: getTotalBudget(
        search.sellAction ?? 'deposit',
        order1.balance,
        search.sellBudget
      ),
    },
  };
};

const getWarning = (search: EditRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersOverlap(buyOrder, sellOrder)) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

const getError = (search: EditRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersReversed(buyOrder, sellOrder)) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

const url = '/strategies/edit/$strategyId/prices/recurring';

export const EditStrategyRecurringPage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const search = useSearch({ from: url });
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder<Search>(url);

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      setBuyOrder({ min: buy.min, max: buy.max });
      setSellOrder({ min: sell.min, max: sell.max });
    },
    [setBuyOrder, setSellOrder]
  );

  const orders = getOrders(strategy, search, marketPrice);
  const isLimit = {
    buy: orders.buy.settings === 'limit',
    sell: orders.sell.settings === 'limit',
  };

  const hasChanged = (() => {
    const { order0, order1 } = strategy;
    if (isOverlappingStrategy(strategy)) return true;
    if (search.buyMin !== order0.startRate) return true;
    if (search.buyMax !== order0.endRate) return true;
    if (!isZero(search.buyBudget)) return true;
    if (search.sellMin !== order1.startRate) return true;
    if (search.sellMax !== order1.endRate) return true;
    if (!isZero(search.sellBudget)) return true;
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

  return (
    <EditStrategyLayout editType={search.editType}>
      <EditStrategyForm
        strategyType="recurring"
        editType={search.editType}
        orders={orders}
        hasChanged={hasChanged}
      >
        <EditStrategyPriceField
          order={orders.sell}
          budget={search.sellBudget ?? ''}
          initialBudget={order1.balance}
          setOrder={setSellOrder}
          warnings={[sellOutsideMarket, getWarning(search)]}
          error={error}
        />
        <EditStrategyPriceField
          order={orders.buy}
          budget={search.buyBudget ?? ''}
          initialBudget={order0.balance}
          setOrder={setBuyOrder}
          warnings={[buyOutsideMarket, getWarning(search)]}
          error={error}
          buy
        />
      </EditStrategyForm>
      <StrategyChartSection>
        <StrategyChartHistory
          type="recurring"
          base={base}
          quote={quote}
          order0={orders.buy}
          order1={orders.sell}
          isLimit={isLimit}
          onPriceUpdates={onPriceUpdates}
        />
      </StrategyChartSection>
    </EditStrategyLayout>
  );
};
