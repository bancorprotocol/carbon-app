import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { EditStrategyOverlapTokens } from 'components/strategies/edit/EditStrategyOverlapTokens';
import { isValidRange } from 'components/strategies/utils';
import { Strategy } from 'libs/queries';
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
import { OverlappingInitMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { isZero } from 'components/strategies/common/utils';
import { getTotalBudget } from 'components/strategies/edit/utils';
import { EditOverlappingBudget } from 'components/strategies/edit/EditOverlappingBudget';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { StrategyChartOverlapping } from 'components/strategies/common/StrategyChartOverlapping';
import { useCallback } from 'react';
import { OverlappingSearch } from 'components/strategies/common/types';

export interface EditBudgetOverlappingSearch extends OverlappingSearch {
  editType: 'deposit' | 'withdraw';
  marketPrice?: string;
  anchor?: 'buy' | 'sell';
  budget?: string;
}

const isTouched = (strategy: Strategy, search: EditBudgetOverlappingSearch) => {
  const { order0, order1 } = strategy;
  if (isZero(order0.balance) && isZero(order1.balance)) return true;
  if (search.marketPrice) return true;
  return false;
};

/** Create the orders out of the search params */
const getOrders = (
  strategy: Strategy,
  search: EditBudgetOverlappingSearch,
  marketPrice?: string
) => {
  const { base, quote, order0, order1 } = strategy;

  if (!marketPrice) {
    return {
      buy: { min: '', max: '', marginalPrice: '', budget: '' },
      sell: { min: '', max: '', marginalPrice: '', budget: '' },
    };
  }

  const min = strategy.order0.startRate;
  const max = strategy.order1.endRate;
  const spread = getRoundedSpread(strategy).toString();
  const { anchor, budget = '0', editType = 'deposit' } = search;

  if (!isValidRange(min, max) || !isValidSpread(spread)) {
    return {
      buy: { min, max: min, marginalPrice: max, budget: '' },
      sell: { min: max, max: max, marginalPrice: min, budget: '' },
    };
  }

  const orders = {
    buy: {
      min: order0.startRate,
      max: order0.endRate,
      marginalPrice: order0.marginalRate,
      budget: order0.balance,
    },
    sell: {
      min: order1.startRate,
      max: order1.endRate,
      marginalPrice: order1.marginalRate,
      budget: order1.balance,
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
    const buyBudget = getTotalBudget(editType, order0.balance, budget);
    orders.buy.budget = buyBudget;
    orders.sell.budget = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      buyBudget
    );
  } else {
    if (isMaxBelowMarket(orders.sell)) return orders;
    const sellBudget = getTotalBudget(editType, order1.balance, budget);
    orders.sell.budget = sellBudget;
    orders.buy.budget = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      sellBudget
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
  const displayPrice = externalPrice?.toString() || search.marketPrice;
  const marketPrice = getOverlappingMarketPrice(
    strategy,
    search,
    externalPrice?.toString()
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
    [navigate]
  );

  return (
    <EditStrategyLayout editType={search.editType}>
      <OverlappingContent />
      <StrategyChartOverlapping
        base={base}
        quote={quote}
        order0={orders.buy}
        order1={orders.sell}
        set={set}
        marketPrice={displayPrice}
        readonly
      />
    </EditStrategyLayout>
  );
};

const OverlappingContent = () => {
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
    externalPrice?.toString()
  );

  const orders = getOrders(strategy, search, marketPrice);

  const hasChanged = (() => {
    if (search.marketPrice) return true;
    if (!isZero(search.budget)) return true;
    return false;
  })();

  if (!marketPrice) {
    const setMarketPrice = (price: string) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, marketPrice: price }),
        replace: true,
        resetScroll: false,
      });
    };
    return (
      <div className="flex flex-col gap-20 md:w-[440px]">
        <EditStrategyOverlapTokens />
        <article className="rounded-10 bg-background-900 flex flex-col">
          <OverlappingInitMarketPrice
            base={base}
            quote={quote}
            marketPrice={marketPrice}
            setMarketPrice={setMarketPrice}
          />
        </article>
      </div>
    );
  }

  return (
    <EditStrategyForm
      strategyType="overlapping"
      editType={search.editType}
      orders={orders}
      hasChanged={hasChanged}
      approveText={
        hasChanged
          ? "I've approved the token deposit(s) and distribution."
          : "I've reviewed the warning(s) but choose to proceed."
      }
    >
      <EditOverlappingBudget
        marketPrice={marketPrice}
        order0={orders.buy}
        order1={orders.sell}
      />
    </EditStrategyForm>
  );
};
