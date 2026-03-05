import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { EditStrategyOverlapTokens } from 'components/strategies/edit/EditStrategyOverlapTokens';
import { isValidRange } from 'components/strategies/utils';
import { Strategy } from 'components/strategies/common/types';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import {
  getOverlappingMarketPrice,
  getRoundedSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { InitMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { isZero } from 'components/strategies/common/utils';
import { getTotalBudget } from 'components/strategies/edit/utils';
import { EditOverlappingBudget } from 'components/strategies/edit/EditOverlappingBudget';
import { EditBudgetForm } from 'components/strategies/edit/EditBudgetForm';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { StrategyChartOverlapping } from 'components/strategies/common/StrategyChartOverlapping';
import { useCallback } from 'react';
import { OverlappingSearch } from 'components/strategies/common/types';
import { SafeDecimal } from 'libs/safedecimal';

export interface EditBudgetOverlappingSearch extends OverlappingSearch {
  editType: 'deposit' | 'withdraw';
  marketPrice?: string;
  anchor?: 'buy' | 'sell';
  budget?: string;
}

const isTouched = (strategy: Strategy, search: EditBudgetOverlappingSearch) => {
  const { buy, sell } = strategy;
  if (isZero(buy.budget) && isZero(sell.budget)) return true;
  if (search.marketPrice) return true;
  return false;
};

/** Create the orders out of the search params */
const getOrders = (
  strategy: Strategy,
  search: EditBudgetOverlappingSearch,
  marketPrice?: string,
) => {
  const { base, quote, buy, sell } = strategy;

  if (!marketPrice) {
    return {
      buy: { min: '', max: '', marginalPrice: '', budget: '' },
      sell: { min: '', max: '', marginalPrice: '', budget: '' },
    };
  }

  const min = strategy.buy.min;
  const max = strategy.sell.max;
  const spread = getRoundedSpread(strategy).toString();
  const { anchor, budget = '0', editType = 'deposit' } = search;

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
  if (isTouched(strategy, search)) {
    const prices = calculateOverlappingPrices(min, max, marketPrice, spread);
    orders.buy.min = prices.buyPriceLow;
    orders.buy.max = prices.buyPriceHigh;
    orders.buy.marginalPrice = prices.buyPriceMarginal;
    orders.sell.min = prices.sellPriceLow;
    orders.sell.max = prices.sellPriceHigh;
    orders.sell.marginalPrice = prices.sellPriceMarginal;
  }

  if (!anchor || isZero(budget)) return orders;

  // BUDGET
  if (anchor === 'buy') {
    if (isMinAboveMarket(orders.buy)) return orders;
    const buyBudget = getTotalBudget(editType, buy.budget, budget);
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
    const sellBudget = getTotalBudget(editType, sell.budget, budget);
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

const url = '/strategies/edit/$strategyId/budget/overlapping';

export const EditBudgetOverlappingPage = () => {
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
  const orders = getOrders(strategy, search, marketPrice);

  const set = useCallback(
    (next: Partial<EditBudgetOverlappingSearch>) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  return (
    <EditStrategyLayout editType={search.editType}>
      <StrategyChartOverlapping
        base={base}
        quote={quote}
        buy={orders.buy}
        sell={orders.sell}
        set={set}
        readonly
      />
      <OverlappingContent />
    </EditStrategyLayout>
  );
};

const OverlappingContent = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
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

  const hasChanged = (() => {
    if (search.marketPrice) return true;
    if (!isZero(search.budget)) return true;
    return false;
  })();

  if (!marketPrice) {
    return (
      <div className="flex flex-col gap-20 md:w-[440px]">
        <EditStrategyOverlapTokens />
        <article className="rounded-lg surface flex flex-col">
          <InitMarketPrice base={base} quote={quote} />
        </article>
      </div>
    );
  }

  return (
    <EditBudgetForm
      editType={search.editType}
      orders={orders}
      hasChanged={hasChanged}
    >
      <EditOverlappingBudget
        marketPrice={marketPrice}
        buy={orders.buy}
        sell={orders.sell}
      />
    </EditBudgetForm>
  );
};
