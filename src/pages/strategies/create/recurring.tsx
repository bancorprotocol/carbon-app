import { useSearch } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { StrategySettings } from 'libs/routing';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { OrderBlock } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import {
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import {
  checkIfOrdersOverlap,
  checkIfOrdersReversed,
} from 'components/strategies/utils';

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

type Search = Omit<CreateRecurringStrategySearch, 'base' | 'quote'>;

const getWarning = (search: CreateRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersOverlap(buyOrder, sellOrder)) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

const getError = (search: CreateRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersReversed(buyOrder, sellOrder)) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

const url = '/strategies/create/recurring';

export const CreateRecurringStrategyPage = () => {
  const { getTokenById } = useTokens();
  const search = useSearch({ from: url });
  const base = getTokenById(search.base);
  const quote = getTokenById(search.quote);
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder<Search>(url);

  const buyOrder: OrderBlock = {
    min: search.buyMin ?? '',
    max: search.buyMax ?? '',
    budget: search.buyBudget ?? '',
    settings: search.buySettings ?? 'range',
  };
  const sellOrder: OrderBlock = {
    min: search.sellMin ?? '',
    max: search.sellMax ?? '',
    budget: search.sellBudget ?? '',
    settings: search.sellSettings ?? 'range',
  };

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

  return (
    <CreateLayout base={base} quote={quote}>
      <CreateForm
        type="recurring"
        base={base!}
        quote={quote!}
        order0={buyOrder}
        order1={sellOrder}
      >
        <CreateOrder
          type="recurring"
          base={base!}
          quote={quote!}
          order={sellOrder}
          setOrder={setSellOrder}
          optionalBudget={+buyOrder.budget > 0 && isZero(sellOrder.budget)}
          error={getError(search)}
          warnings={[sellOutsideMarket, getWarning(search)]}
        />
        <CreateOrder
          type="recurring"
          base={base!}
          quote={quote!}
          order={buyOrder}
          setOrder={setBuyOrder}
          optionalBudget={+sellOrder.budget > 0 && isZero(buyOrder.budget)}
          error={getError(search)}
          warnings={[buyOutsideMarket, getWarning(search)]}
          buy
        />
      </CreateForm>
    </CreateLayout>
  );
};
