import { useNavigate, useSearch } from '@tanstack/react-router';
import { useStrategyFormCtx } from 'components/strategies/common/StrategyFormContext';
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
  const { base, quote, marketPrice } = useStrategyFormCtx();
  const navigate = useNavigate({ from: url });
  const search = useSearch({ from: url });
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
            anchor={search.anchor}
            set={set}
          />
          <CreateOverlappingBudget
            base={base}
            quote={quote}
            buy={orders.buy}
            sell={orders.sell}
            anchor={search.anchor}
            budget={search.budget}
            set={set}
          />
        </CreateForm>
      </CreateLayout>
    </>
  );
};
