import { m } from 'libs/motion';
import { items } from 'components/strategies/common/variants';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { isValidRange } from 'components/strategies/utils';
import { CreateOverlapping } from 'components/strategies/create/CreateOverlapping';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { OverlappingInitMarketPriceField } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { isZero } from 'components/strategies/common/utils';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { Token } from 'libs/tokens';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import {
  CreateForm,
  CreateFormHeader,
} from 'components/strategies/create/CreateForm';

export interface CreateOverlappingStrategySearch {
  base: string;
  quote: string;
  marketPrice?: string;
  min?: string;
  max?: string;
  spread?: string;
  anchor?: 'buy' | 'sell';
  budget?: string;
}
type Search = CreateOverlappingStrategySearch;

const initSpread = '0.05';

const initMin = (marketPrice: string) => {
  return new SafeDecimal(marketPrice).times(0.99).toString();
};
const initMax = (marketPrice: string) => {
  return new SafeDecimal(marketPrice).times(1.01).toString();
};

/** Create the orders out of the search params */
const getOrders = (
  search: Search,
  base?: Token,
  quote?: Token,
  marketPrice?: string
) => {
  if (!base || !quote || !marketPrice) {
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
    budget,
  } = search;
  if (!isValidRange(min, max) || !isValidSpread(spread)) {
    return {
      buy: { min, max: min, marginalPrice: min, budget: '' },
      sell: { min, max: min, marginalPrice: min, budget: '' },
    };
  }
  const prices = calculateOverlappingPrices(min, max, marketPrice, spread);
  const orders = {
    buy: {
      min: prices.buyPriceLow,
      max: prices.buyPriceHigh,
      marginalPrice: prices.buyPriceMarginal,
      budget: '',
    },
    sell: {
      min: prices.sellPriceLow,
      max: prices.sellPriceHigh,
      marginalPrice: prices.sellPriceMarginal,
      budget: '',
    },
  };
  if (!anchor || isZero(budget)) return orders;
  if (anchor === 'buy') {
    if (isMinAboveMarket(orders.buy)) return orders;
    orders.buy.budget = budget;
    orders.sell.budget = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      budget
    );
  } else {
    if (isMaxBelowMarket(orders.sell)) return orders;
    orders.sell.budget = budget;
    orders.buy.budget = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      budget
    );
  }
  return orders;
};

export const CreateOverlappingStrategyPage = () => {
  const { getTokenById } = useTokens();
  const navigate = useNavigate({ from: '/strategies/create/overlapping' });
  const search = useSearch({ from: '/strategies/create/overlapping' });
  const base = getTokenById(search.base);
  const quote = getTokenById(search.quote);
  const externalPrice = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? externalPrice?.toString();

  const orders = getOrders(search, base, quote, marketPrice);

  if (!marketPrice) {
    const setMarketPrice = (price: number) => {
      navigate({
        search: (previous) => ({ ...previous, marketPrice: price.toString() }),
        replace: true,
        resetScroll: false,
      });
    };
    return (
      <CreateLayout base={base} quote={quote}>
        <div className="flex flex-col gap-20">
          <CreateFormHeader type="overlapping" base={base!} quote={quote!} />
          <m.article
            variants={items}
            key="marketPrice"
            className="rounded-10 bg-background-900 flex flex-col md:w-[440px]"
          >
            <OverlappingInitMarketPriceField
              base={base!}
              quote={quote!}
              marketPrice={+(marketPrice || '')}
              setMarketPrice={setMarketPrice}
            />
          </m.article>
        </div>
      </CreateLayout>
    );
  }

  return (
    <CreateLayout base={base} quote={quote}>
      <CreateForm
        type="overlapping"
        base={base!}
        quote={quote!}
        order0={orders.buy}
        order1={orders.sell}
        approvalText={
          isZero(search.budget)
            ? "I've reviewed the warning(s) but choose to proceed."
            : "I've approved the token deposit(s) and distribution."
        }
      >
        <CreateOverlapping
          base={base!}
          quote={quote!}
          marketPrice={marketPrice}
          order0={orders.buy}
          order1={orders.sell}
          spread={search.spread || initSpread}
        />
      </CreateForm>
    </CreateLayout>
  );
};
