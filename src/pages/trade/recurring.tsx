import { useSearch } from '@tanstack/react-router';
import { OrderBlock } from 'components/strategies/common/types';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  getRecurringError,
  getRecurringWarning,
} from 'components/strategies/create/utils';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { TradeLayout } from 'components/trade/TradeLayout';

const url = '/trade/recurring';
export const TradeRecurring = () => {
  const search = useSearch({ from: url });
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setSellOrder, setBuyOrder } =
    useSetRecurringOrder<typeof search>(url);
  const sellOrder: OrderBlock = {
    min: search.sellMin ?? '',
    max: search.sellMax ?? '',
    budget: search.sellBudget ?? '',
    settings: search.sellSettings ?? 'limit',
  };
  const buyOrder: OrderBlock = {
    min: search.buyMin ?? '',
    max: search.buyMax ?? '',
    budget: search.buyBudget ?? '',
    settings: search.buySettings ?? 'limit',
  };
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
    <>
      <TradeLayout>
        <CreateForm
          type="recurring"
          base={base!}
          quote={quote!}
          order0={buyOrder}
          order1={sellOrder}
        >
          <CreateOrder
            type="recurring"
            base={base}
            quote={quote}
            order={sellOrder}
            setOrder={setSellOrder}
            error={getRecurringError(search)}
            warnings={[sellOutsideMarket, getRecurringWarning(search)]}
          />
          <CreateOrder
            type="recurring"
            base={base}
            quote={quote}
            order={buyOrder}
            setOrder={setBuyOrder}
            error={getRecurringError(search)}
            warnings={[buyOutsideMarket, getRecurringWarning(search)]}
            buy
          />
        </CreateForm>
      </TradeLayout>
      <TradeChartSection />
    </>
  );
};
