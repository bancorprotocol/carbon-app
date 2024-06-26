import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { EditStrategyOverlapTokens } from 'components/strategies/edit/EditStrategyOverlapTokens';
import { roundSearchParam } from 'utils/helpers';
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
  getOverlappingMarketPrice,
  getRoundedSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { EditOverlappingPrice } from 'components/strategies/edit/EditOverlappingPrice';
import { isOverlappingTouched } from 'components/strategies/overlapping/utils';
import { OverlappingInitMarketPriceField } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { isZero } from 'components/strategies/common/utils';
import { getTotalBudget } from 'components/strategies/edit/utils';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';

export interface EditOverlappingStrategySearch {
  editType: 'editPrices' | 'renew';
  marketPrice?: string;
  min?: string;
  max?: string;
  spread?: string;
  anchor?: 'buy' | 'sell';
  budget?: string;
  action?: 'deposit' | 'withdraw';
}

const initSpread = '0.05';

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
    spread = initSpread,
    budget = '0',
    action = 'deposit',
  } = search;

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

export const EditStrategyOverlappingPage = () => {
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
  const spread = isValidSpread(search.spread) ? search.spread! : initSpread;

  const hasChanged = (() => {
    if (search.min !== roundSearchParam(order0.startRate)) return true;
    if (search.max !== roundSearchParam(order1.endRate)) return true;
    if (search.spread !== getRoundedSpread(strategy).toString()) return true;
    if (search.budget) return true;
    return false;
  })();

  if (isPending) {
    return (
      <div className="grid md:w-[440px]">
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
      <div className="flex flex-col gap-20 md:w-[440px]">
        <EditPriceNav editType={search.editType} />
        <EditStrategyOverlapTokens />
        <article className="rounded-10 bg-background-900 flex flex-col">
          <OverlappingInitMarketPriceField
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
      <EditOverlappingPrice
        marketPrice={marketPrice}
        order0={orders.buy}
        order1={orders.sell}
        spread={spread}
      />
    </EditStrategyForm>
  );
};
