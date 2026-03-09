import { useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  isZero,
  isOverlappingStrategy,
  outSideMarketWarning,
  isLimitOrder,
} from 'components/strategies/common/utils';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import {
  checkIfOrdersOverlap,
  checkIfOrdersReversed,
} from 'components/strategies/utils';
import { getTotalBudget } from 'components/strategies/edit/utils';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { OnPriceUpdates } from 'components/strategies/common/d3Chart';
import { useCallback } from 'react';
import { EditOrderBlock } from 'components/strategies/common/types';
import { StaticOrder, Strategy } from 'components/strategies/common/types';
import { SafeDecimal } from 'libs/safedecimal';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { useDebouncePrices } from 'components/strategies/common/d3Chart/useDebouncePrices';
import { D3ChartRecurring } from 'components/strategies/common/d3Chart/recurring/D3ChartRecurring';
import { TradeChartContent } from 'components/strategies/common/d3Chart/TradeChartContent';
import { D3PricesAxis } from 'components/strategies/common/d3Chart/D3PriceAxis';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { EditPricesForm } from 'components/strategies/edit/EditPricesForm';
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';

export interface EditRecurringStrategySearch {
  chartStart?: string;
  chartEnd?: string;
  editType: 'editPrices' | 'renew';
  buyMin?: string;
  buyMax?: string;
  buySettings?: StrategySettings;
  buyBudget?: string;
  buyAction?: 'deposit' | 'withdraw';
  buyMarginalPrice?: MarginalPriceOptions;
  sellMin?: string;
  sellMax?: string;
  sellSettings?: StrategySettings;
  sellBudget?: string;
  sellAction?: 'deposit' | 'withdraw';
  sellMarginalPrice?: MarginalPriceOptions;
}

type Search = EditRecurringStrategySearch;

const getOrders = (
  strategy: Strategy,
  search: Search,
  marketPrice?: string,
): { buy: EditOrderBlock; sell: EditOrderBlock } => {
  const { buy, sell } = strategy;

  const defaultMin = (
    direction: StrategyDirection,
    settings: StrategySettings = 'limit',
  ) => {
    const isBuy = direction === 'buy';
    const defaultPrice = isBuy ? buy.min : sell.max;
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
    settings: StrategySettings = 'limit',
  ) => {
    const isBuy = direction === 'buy';
    const defaultPrice = isBuy ? buy.min : sell.max;
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
  const defaultSettings = (order: StaticOrder) => {
    return isLimitOrder(order) ? 'limit' : 'range';
  };
  return {
    buy: {
      min: search.buyMin ?? defaultMin('buy', search.buySettings) ?? '',
      max: search.buyMax ?? defaultMax('buy', search.buySettings) ?? '',
      settings: search.buySettings ?? defaultSettings(buy),
      action: search.buyAction ?? 'deposit',
      budget: getTotalBudget(
        search.buyAction ?? 'deposit',
        buy.budget,
        search.buyBudget,
      ),
      marginalPrice: search.buyMarginalPrice,
    },
    sell: {
      min: search.sellMin ?? defaultMin('sell', search.sellSettings) ?? '',
      max: search.sellMax ?? defaultMax('sell', search.sellSettings) ?? '',
      settings: search.sellSettings ?? defaultSettings(sell),
      action: search.sellAction ?? 'deposit',
      budget: getTotalBudget(
        search.sellAction ?? 'deposit',
        sell.budget,
        search.sellBudget,
      ),
      marginalPrice: search.sellMarginalPrice,
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

export const EditPricesStrategyRecurringPage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, buy, sell } = strategy;
  const search = useSearch({ from: url });
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder<Search>(url);

  const updatePrices: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      setBuyOrder({ min: buy.min, max: buy.max });
      setSellOrder({ min: sell.min, max: sell.max });
    },
    [setBuyOrder, setSellOrder],
  );

  const orders = getOrders(strategy, search, marketPrice);
  const isLimit = {
    buy: orders.buy.settings === 'limit',
    sell: orders.sell.settings === 'limit',
  };

  const hasBuyPriceChanged =
    search.buyMin !== buy.min || search.buyMax !== buy.max;
  const hasSellPriceChanged =
    search.sellMin !== sell.min || search.sellMax !== sell.max;

  const hasChanged = (() => {
    if (isOverlappingStrategy(strategy)) return true;
    if (hasBuyPriceChanged) return true;
    if (!isZero(search.buyBudget)) return true;
    if (hasSellPriceChanged) return true;
    if (!isZero(search.sellBudget)) return true;
    return false;
  })();

  // Warnings
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.sellMin,
    max: search.sellMax,
    isBuy: false,
  });
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.buyMin,
    max: search.buyMax,
    isBuy: true,
  });
  const { prices, setPrices } = useDebouncePrices(
    orders.buy,
    orders.sell,
    updatePrices,
  );

  const error = getError(search);

  return (
    <EditStrategyLayout editType={search.editType}>
      <StrategyChartSection
        editMarketPrice={<EditMarketPrice base={base} quote={quote} />}
      >
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
            prices={prices}
            onChange={setPrices}
          />
          <TradeChartContent />
          <D3PricesAxis prices={prices} />
        </StrategyChartHistory>
      </StrategyChartSection>
      <EditPricesForm
        editType={search.editType}
        orders={orders}
        hasChanged={hasChanged}
      >
        <EditStrategyPriceField
          direction="sell"
          order={orders.sell}
          budget={search.sellBudget ?? ''}
          initialOrder={sell}
          hasPriceChanged={hasSellPriceChanged}
          setOrder={setSellOrder}
          warnings={[sellOutsideMarket, getWarning(search)]}
          error={error}
        />
        <EditStrategyPriceField
          direction="buy"
          order={orders.buy}
          budget={search.buyBudget ?? ''}
          initialOrder={buy}
          hasPriceChanged={hasBuyPriceChanged}
          setOrder={setBuyOrder}
          warnings={[buyOutsideMarket, getWarning(search)]}
          error={error}
        />
      </EditPricesForm>
    </EditStrategyLayout>
  );
};
