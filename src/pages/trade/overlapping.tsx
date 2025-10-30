import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTradeCtx } from 'components/trade/context';
import { CreateOverlappingPrice } from 'components/strategies/create/CreateOverlappingPrice';
import { getOverlappingOrders } from 'components/strategies/create/utils';
import { StrategyChartOverlapping } from 'components/strategies/common/StrategyChartOverlapping';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { CreateOverlappingBudget } from 'components/strategies/create/CreateOverlappingBudget';
import { useCallback } from 'react';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';
import { useStrategyMarketPrice } from 'components/strategies/UserMarketPrice';
import { CreateLayout } from 'components/strategies/create/CreateLayout';

const url = '/trade/overlapping';
export const TradeOverlapping = () => {
  const { base, quote } = useTradeCtx();
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
  const { marketPrice } = useStrategyMarketPrice({ base, quote });
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
      <StrategyChartOverlapping
        base={base}
        quote={quote}
        buy={orders.buy}
        sell={orders.sell}
        set={set}
      />
      <CreateLayout url={url}>
        <CreateForm
          base={base}
          quote={quote}
          buy={orders.buy}
          sell={orders.sell}
        >
          <CreateOverlappingPrice
            base={base!}
            quote={quote!}
            buy={orders.buy}
            sell={orders.sell}
            spread={search.spread || ''}
            set={set}
          />
          <CreateOverlappingBudget
            base={base}
            quote={quote}
            buy={orders.buy}
            sell={orders.sell}
            set={set}
          />
        </CreateForm>
      </CreateLayout>
    </>
  );
};
