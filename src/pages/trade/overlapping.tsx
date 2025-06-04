import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { CreateOverlappingPrice } from 'components/strategies/create/CreateOverlappingPrice';
import { getOverlappingOrders } from 'components/strategies/create/utils';
import { StrategyChartOverlapping } from 'components/strategies/common/StrategyChartOverlapping';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { CreateOverlappingBudget } from 'components/strategies/create/CreateOverlappingBudget';
import { useCallback } from 'react';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';
import { CreateLayout } from 'components/strategies/create/CreateLayout';

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
    [navigate],
  );

  return (
    <>
      <CreateLayout url={url}>
        <CreateForm
          base={base}
          quote={quote}
          order0={orders.buy}
          order1={orders.sell}
          approvalText="I've approve the token deposit(s) and distribution"
        >
          <CreateOverlappingPrice
            base={base!}
            quote={quote!}
            marketPrice={marketPrice!}
            order0={orders.buy}
            order1={orders.sell}
            spread={search.spread || ''}
            set={set}
          />
          <CreateOverlappingBudget
            base={base}
            quote={quote}
            marketPrice={marketPrice!}
            order0={orders.buy}
            order1={orders.sell}
            set={set}
          />
        </CreateForm>
      </CreateLayout>
      <StrategyChartOverlapping
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
