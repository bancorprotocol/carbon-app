import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { useTradeCtx } from 'components/trade/TradeContext';
import { Outlet, useNavigate, useSearch } from '@tanstack/react-router';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { useCallback } from 'react';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { InitMarketPrice } from 'components/strategies/common/InitMarketPrice';

export const EditPriceLayout = () => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ from: '/strategies/edit/$strategyId/prices' });
  const navigate = useNavigate({ from: '/strategies/edit/$strategyId/prices' });
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();
  const setMarketPrice = useCallback(
    (marketPrice: string) => {
      navigate({
        search: (previous) => ({ ...previous, marketPrice }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  if (!marketPrice && marketQuery.isPending) {
    return (
      <EditStrategyLayout editType={search.editType}>
        <CarbonLogoLoading className="h-[80px] place-self-center" />
      </EditStrategyLayout>
    );
  }

  if (!marketPrice) {
    return (
      <EditStrategyLayout editType={search.editType}>
        <article
          key="marketPrice"
          className="bg-background-900 rounded-ee rounded-es"
        >
          <InitMarketPrice
            base={base}
            quote={quote}
            setMarketPrice={(price) => setMarketPrice(price)}
          />
        </article>
      </EditStrategyLayout>
    );
  }
  return (
    <EditStrategyLayout editType={search.editType}>
      <Outlet />
    </EditStrategyLayout>
  );
};
