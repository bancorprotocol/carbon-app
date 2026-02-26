import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { isValidRange } from 'components/strategies/utils';
import { Strategy } from 'components/strategies/common/types';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  getOverlappingMarketPrice,
  getRoundedSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { EditOverlappingPrice } from 'components/strategies/edit/EditOverlappingPrice';
import { isOverlappingTouched } from 'components/strategies/overlapping/utils';
import { SafeDecimal } from 'libs/safedecimal';
import {
  getFullRangesPrices,
  isZero,
} from 'components/strategies/common/utils';
import { getTotalBudget } from 'components/strategies/edit/utils';
import { StrategyChartOverlapping } from 'components/strategies/common/StrategyChartOverlapping';
import { useCallback } from 'react';
import { OverlappingSearch } from 'components/strategies/common/types';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { EditPricesForm } from 'components/strategies/edit/EditPricesForm';
import {
  initOverlappingMax,
  initOverlappingMin,
} from 'components/strategies/create/utils';

export interface EditOverlappingStrategySearch extends OverlappingSearch {
  editType: 'editPrices' | 'renew';
  action?: 'deposit' | 'withdraw';
}

const defaultSpread = '0.05';

/** Create the orders out of the search params */
const getOrders = (
  strategy: Strategy,
  search: EditOverlappingStrategySearch,
  marketPrice?: string,
) => {
  const { base, quote, buy, sell } = strategy;

  if (!marketPrice) {
    return {
      buy: { min: '', max: '', marginalPrice: '', budget: '' },
      sell: { min: '', max: '', marginalPrice: '', budget: '' },
    };
  }

  const fullRange = (() => {
    if (!search.fullRange) return;
    return getFullRangesPrices(marketPrice, base.decimals, quote.decimals);
  })();

  const {
    anchor,
    min = initOverlappingMin(marketPrice, fullRange?.min),
    max = initOverlappingMax(marketPrice, fullRange?.max),
    spread = defaultSpread,
    budget = '0',
    action = 'deposit',
  } = search;

  if (!isValidRange(min, max) || !isValidSpread(min, max, spread)) {
    let marginalPrice = marketPrice;
    if (new SafeDecimal(marketPrice).gt(max)) marginalPrice = max;
    if (new SafeDecimal(marketPrice).lt(min)) marginalPrice = min;
    return {
      buy: { min: min, max: max, marginalPrice, budget: '' },
      sell: { min: min, max: max, marginalPrice, budget: '' },
    };
  }

  const orders = {
    buy: {
      min: buy.min,
      max: buy.max,
      marginalPrice: buy.marginalPrice,
      budget: buy.budget,
    },
    sell: {
      min: sell.min,
      max: sell.max,
      marginalPrice: sell.marginalPrice,
      budget: sell.budget,
    },
  };

  // PRICES
  const touched = isOverlappingTouched(strategy, search);
  if (touched) {
    const prices = calculateOverlappingPrices(min, max, marketPrice, spread);
    orders.buy.min = prices.buyPriceLow;
    orders.buy.max = prices.buyPriceHigh;
    orders.buy.marginalPrice = prices.buyPriceMarginal;
    orders.sell.min = prices.sellPriceLow;
    orders.sell.max = prices.sellPriceHigh;
    orders.sell.marginalPrice = prices.sellPriceMarginal;
  }

  if (!anchor) return orders;

  // If there is no changes we don't recalculate the budget because of precision delta
  if (!touched && isZero(budget)) return orders;

  // BUDGET
  if (anchor === 'buy') {
    if (isMinAboveMarket(orders.buy)) return orders;
    const buyBudget = getTotalBudget(action, buy.budget, budget);
    orders.buy.budget = buyBudget;
    orders.sell.budget = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      buyBudget,
    );
  } else {
    if (isMaxBelowMarket(orders.sell)) return orders;
    const sellBudget = getTotalBudget(action, sell.budget, budget);
    orders.sell.budget = sellBudget;
    orders.buy.budget = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      sellBudget,
    );
  }
  return orders;
};

const url = '/strategies/edit/$strategyId/prices/overlapping';
export const EditPricesOverlappingPage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const { marketPrice: externalPrice } = useMarketPrice({
    base,
    quote,
  });
  const marketPrice = getOverlappingMarketPrice(
    strategy,
    search,
    externalPrice?.toString(),
  );

  const set = useCallback(
    (next: Partial<EditOverlappingStrategySearch>) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const orders = getOrders(strategy, search, marketPrice);
  return (
    <EditStrategyLayout editType={search.editType}>
      <StrategyChartOverlapping
        base={base}
        quote={quote}
        buy={orders.buy}
        sell={orders.sell}
        set={set}
      />
      <OverlappingContent />
    </EditStrategyLayout>
  );
};

const OverlappingContent = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, buy, sell } = strategy;
  const search = useSearch({ from: url });
  const { marketPrice: externalPrice } = useMarketPrice({
    base,
    quote,
  });
  const marketPrice = getOverlappingMarketPrice(
    strategy,
    search,
    externalPrice?.toString(),
  );

  const orders = getOrders(strategy, search, marketPrice);
  const spread = search.spread || defaultSpread;

  const hasChanged = (() => {
    if (search.min !== buy.min) return true;
    if (search.max !== sell.max) return true;
    if (search.spread !== getRoundedSpread(strategy).toString()) return true;
    if (search.marketPrice) return true;
    if (!isZero(search.budget)) return true;
    return false;
  })();

  return (
    <EditPricesForm
      editType={search.editType}
      orders={orders}
      hasChanged={hasChanged}
    >
      <EditOverlappingPrice
        buy={orders.buy}
        sell={orders.sell}
        spread={spread}
      />
    </EditPricesForm>
  );
};
