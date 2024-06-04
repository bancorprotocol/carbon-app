import { useCallback } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { OrderFields } from 'components/strategies/create/Order/OrderFields';
import { OrderBlock } from 'components/strategies/create/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { outSideMarketWarning } from 'components/strategies/create/Order/utils';

export interface CreateRecurringStrategySearch {
  base: string;
  quote: string;
  buyMin?: string;
  buyMax?: string;
  buyBudget?: string;
  buySettings: StrategySettings;
  sellMin?: string;
  sellMax?: string;
  sellBudget?: string;
  sellSettings: StrategySettings;
}

type OrderKey = keyof Omit<CreateRecurringStrategySearch, 'base' | 'quote'>;
const toOrderSearch = (
  order: Partial<OrderBlock>,
  direction: 'buy' | 'sell'
) => {
  const search: Partial<CreateRecurringStrategySearch> = {};
  for (const [key, value] of Object.entries(order)) {
    const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
    const searchKey = `${direction}${camelCaseKey}` as OrderKey;
    search[searchKey] = value as any;
  }
  return search;
};

const getWarning = (search: CreateRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const sellMinInRange =
    buyMin && buyMax && sellMin && +sellMin >= +buyMin && +sellMin < +buyMax;
  const buyMaxInRange =
    sellMin && sellMax && buyMax && +buyMax >= +sellMin && +buyMax < +sellMax;
  if (sellMinInRange || buyMaxInRange) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

const getError = (search: CreateRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const minReversed = buyMin && sellMin && +buyMin > +sellMin;
  const maxReversed = buyMax && sellMax && +buyMax > +sellMax;
  if (minReversed || maxReversed) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

export const CreateRecurringStrategyPage = () => {
  const { getTokenById } = useTokens();
  const navigate = useNavigate({ from: '/strategies/create/recurring' });
  const search = useSearch({ from: '/strategies/create/recurring' });
  const base = getTokenById(search.base);
  const quote = getTokenById(search.quote);
  const marketPrice = useMarketPrice({ base, quote });

  const buyOrder: OrderBlock = {
    min: search.buyMin ?? '',
    max: search.buyMax ?? '',
    marginalPrice: '',
    budget: search.buyBudget ?? '',
    settings: search.buySettings ?? 'range',
  };
  const sellOrder: OrderBlock = {
    min: search.sellMin ?? '',
    max: search.sellMax ?? '',
    marginalPrice: '',
    budget: search.sellBudget ?? '',
    settings: search.sellSettings ?? 'range',
  };

  const setOrder = useCallback(
    (order: Partial<OrderBlock>, direction: StrategyDirection) => {
      navigate({
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

  // Warnings
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.sellMin,
    max: search.sellMax,
    buy: false,
  });
  const buyOutSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.buyMin,
    max: search.buyMax,
    buy: true,
  });

  return (
    <CreateLayout base={base} quote={quote}>
      <CreateForm
        type="recurring"
        base={base!}
        quote={quote!}
        order0={buyOrder}
        order1={sellOrder}
      >
        <OrderFields
          type="recurring"
          base={base!}
          quote={quote!}
          order={sellOrder}
          setOrder={setSellOrder}
          optionalBudget={+buyOrder.budget > 0 && !sellOrder.budget}
          error={getError(search)}
          warnings={[sellOutsideMarket, getWarning(search)]}
        />
        <OrderFields
          type="recurring"
          base={base!}
          quote={quote!}
          order={buyOrder}
          setOrder={setBuyOrder}
          optionalBudget={+sellOrder.budget > 0 && !buyOrder.budget}
          error={getError(search)}
          warnings={[buyOutSideMarket, getWarning(search)]}
          buy
        />
      </CreateForm>
    </CreateLayout>
  );
};
