import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { CreateOverlappingPrice } from 'components/strategies/create/CreateOverlappingPrice';
import { OverlappingInitMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import {
  getOverlappingOrders,
  initSpread,
} from 'components/strategies/create/utils';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradeOverlappingChart } from 'components/trade/TradeOverlappingChart';
import { TradeLayout } from 'components/trade/TradeLayout';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { CreateOverlappingBudget } from 'components/strategies/create/CreateOverlappingBudget';
import { useCallback } from 'react';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';

const url = '/trade/overlapping';
export const TradeOverlapping = () => {
  const { base, quote } = useTradeCtx();
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();
  const orders = getOverlappingOrders(search, base, quote, marketPrice);

  const set = useCallback(
    (next: TradeOverlappingSearch) => {
      navigate({
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  if (!marketPrice && marketQuery.isPending) {
    return (
      <TradeLayout>
        <CarbonLogoLoading className="h-[80px] place-self-center" />
      </TradeLayout>
    );
  }

  if (!marketPrice) {
    return (
      <>
        <TradeLayout>
          <article key="marketPrice" className="bg-background-900 rounded">
            <OverlappingInitMarketPrice
              base={base}
              quote={quote}
              marketPrice={marketPrice}
              setMarketPrice={(price) => set({ marketPrice: price })}
            />
          </article>
        </TradeLayout>
        <TradeOverlappingChart
          base={base}
          quote={quote}
          marketPrice={marketPrice}
          order0={orders.buy}
          order1={orders.sell}
          set={set}
        />
      </>
    );
  }

  return (
    <>
      <TradeLayout>
        <CreateForm
          type="overlapping"
          base={base}
          quote={quote}
          order0={orders.buy}
          order1={orders.sell}
          approvalText="I've approve the token deposit(s) and distribution"
        >
          <CreateOverlappingPrice
            base={base!}
            quote={quote!}
            marketPrice={marketPrice}
            order0={orders.buy}
            order1={orders.sell}
            spread={search.spread || initSpread}
            set={set}
          />
          <CreateOverlappingBudget
            base={base}
            quote={quote}
            marketPrice={marketPrice}
            order0={orders.buy}
            order1={orders.sell}
            set={set}
          />
        </CreateForm>
      </TradeLayout>
      <TradeOverlappingChart
        base={base}
        quote={quote}
        order0={orders.buy}
        order1={orders.sell}
        set={set}
        marketPrice={marketPrice}
      />
    </>
  );
};
