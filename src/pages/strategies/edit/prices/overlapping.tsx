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
import { EditPriceNav } from 'components/strategies/edit/EditPriceNav';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  getCalculatedPrice,
  getOverlappingMarketPrice,
  getRoundedSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { EditOverlappingPrice } from 'components/strategies/edit/EditOverlappingPrice';
import { isOverlappingTouched } from 'components/strategies/overlapping/utils';
import { EditOverlappingMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { isZero } from 'components/strategies/common/utils';
import { getTotalBudget } from 'components/strategies/edit/utils';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { StrategyChartOverlapping } from 'components/strategies/common/StrategyChartOverlapping';
import { useCallback } from 'react';
import { OverlappingSearch } from 'components/strategies/common/types';

export interface EditOverlappingStrategySearch extends OverlappingSearch {
  editType: 'editPrices' | 'renew';
  action?: 'deposit' | 'withdraw';
}

const defaultSpread = '0.05';

const initMin = (marketPrice: string) => {
  return new SafeDecimal(marketPrice).times(0.99).toString();
};
const initMax = (marketPrice: string) => {
  return new SafeDecimal(marketPrice).times(1.01).toString();
};

/** Create the orders out of the search params */
const getOrders = (
  strategy: Strategy,
  search: EditOverlappingStrategySearch,
  marketPrice?: string
) => {
  const { base, quote, order0, order1 } = strategy;

  if (!marketPrice) {
    return {
      buy: { min: '', max: '', marginalPrice: '', budget: '' },
      sell: { min: '', max: '', marginalPrice: '', budget: '' },
    };
  }

  const {
    anchor,
    min = initMin(marketPrice),
    max = initMax(marketPrice),
    spread = defaultSpread,
    budget = '0',
    action = 'deposit',
  } = search;

  if (!isValidRange(min, max) || !isValidSpread(spread)) {
    return {
      buy: { min: min, max: max, marginalPrice: marketPrice, budget: '' },
      sell: { min: min, max: max, marginalPrice: marketPrice, budget: '' },
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
    const buyBudget = getTotalBudget(action, order0.balance, budget);
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
    const sellBudget = getTotalBudget(action, order1.balance, budget);
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
  const displayPrice = externalPrice?.toString() || search.marketPrice;
  const marketPrice = getOverlappingMarketPrice(
    strategy,
    search,
    externalPrice?.toString()
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
    [navigate]
  );

  const orders = getOrders(strategy, search, marketPrice);
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
      />
    </EditStrategyLayout>
  );
};

const OverlappingContent = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const { marketPrice: externalPrice, isPending } = useMarketPrice({
    base,
    quote,
  });
  const marketPrice = getOverlappingMarketPrice(
    strategy,
    search,
    externalPrice?.toString()
  );

  const orders = getOrders(strategy, search, marketPrice);
  const spread = isValidSpread(search.spread) ? search.spread! : defaultSpread;

  const hasChanged = (() => {
    if (search.min !== order0.startRate) return true;
    if (search.max !== order1.endRate) return true;
    if (search.spread !== getRoundedSpread(strategy).toString()) return true;
    if (search.marketPrice) return true;
    if (!isZero(search.budget)) return true;
    return false;
  })();

  if (isPending) {
    return (
      <div className="grid">
        <CarbonLogoLoading className="h-80 place-self-center" />
      </div>
    );
  }

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
      <div className="grid content-start rounded">
        <EditStrategyOverlapTokens />
        <EditPriceNav editType={search.editType} />
        <article className="bg-background-900 grid gap-16 p-16">
          <EditOverlappingMarketPrice
            base={base}
            quote={quote}
            calculatedPrice={getCalculatedPrice(strategy)}
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
      <EditOverlappingPrice
        marketPrice={marketPrice}
        order0={orders.buy}
        order1={orders.sell}
        spread={spread}
      />
    </EditStrategyForm>
  );
};
