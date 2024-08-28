import { useSearch } from '@tanstack/react-router';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { CreateOrder } from 'components/strategies/create/CreateOrder';
import { TradeChartSection } from 'components/trade/TradeChartSection';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  getDefaultOrder,
  getRecurringError,
  getRecurringWarning,
} from 'components/strategies/create/utils';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { TradeLayout } from 'components/trade/TradeLayout';
import { TradeChartHistory } from 'components/trade/TradeChartHistory';

const url = '/trade/recurring';
export const TradeRecurring = () => {
  const search = useSearch({ from: url });
  const { base, quote } = useTradeCtx();
  const { marketPrice } = useMarketPrice({ base, quote });
  const { setSellOrder, setBuyOrder } =
    useSetRecurringOrder<typeof search>(url);
  const sellOrder = getDefaultOrder(
    'sell',
    {
      min: search.sellMin,
      max: search.sellMax,
      budget: search.sellBudget,
      settings: search.sellSettings,
    },
    marketPrice
  );
  const buyOrder = getDefaultOrder(
    'buy',
    {
      min: search.buyMin,
      max: search.buyMax,
      budget: search.buyBudget,
      settings: search.buySettings,
    },
    marketPrice
  );
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: sellOrder.min,
    max: sellOrder.max,
    buy: false,
  });
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: buyOrder.min,
    max: buyOrder.max,
    buy: true,
  });
  const isLimit = {
    buy: buyOrder.settings === 'limit',
    sell: sellOrder.settings === 'limit',
  };

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
      <TradeChartSection>
        <TradeChartHistory
          type="recurring"
          order0={buyOrder}
          order1={sellOrder}
          isLimit={isLimit}
        />
      </TradeChartSection>
    </>
  );
};
